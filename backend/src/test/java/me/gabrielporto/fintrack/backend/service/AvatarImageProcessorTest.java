package me.gabrielporto.fintrack.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.imageio.ImageIO;
import me.gabrielporto.fintrack.backend.exception.BusinessException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

class AvatarImageProcessorTest {

    private final AvatarImageProcessor processor = new AvatarImageProcessor();

    private byte[] generateImage(int width, int height, String format) throws IOException {
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = image.createGraphics();
        g.setColor(Color.BLUE);
        g.fillRect(0, 0, width, height);
        g.dispose();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ImageIO.write(image, format, out);
        return out.toByteArray();
    }

    private byte[] decodeDataUrl(String dataUrl) {
        String base64 = dataUrl.substring(dataUrl.indexOf(',') + 1);
        return Base64.getDecoder().decode(base64);
    }

    @Test
    @DisplayName("Aceita um PNG válido e devolve um data URL PNG")
    void acceptsValidPng() throws IOException {
        byte[] png = generateImage(64, 64, "png");
        MockMultipartFile file = new MockMultipartFile("file", "avatar.png", "image/png", png);

        String result = processor.process(file);

        assertThat(result).startsWith("data:image/png;base64,");
        byte[] decoded = decodeDataUrl(result);
        assertThat(decoded[0] & 0xFF).isEqualTo(0x89);
        assertThat(decoded[1]).isEqualTo((byte) 0x50);
    }

    @Test
    @DisplayName("Aceita um JPEG válido e devolve um data URL JPEG")
    void acceptsValidJpeg() throws IOException {
        byte[] jpeg = generateImage(64, 64, "jpeg");
        MockMultipartFile file = new MockMultipartFile("file", "avatar.jpg", "image/jpeg", jpeg);

        String result = processor.process(file);

        assertThat(result).startsWith("data:image/jpeg;base64,");
        byte[] decoded = decodeDataUrl(result);
        assertThat(decoded[0]).isEqualTo((byte) 0xFF);
        assertThat(decoded[1]).isEqualTo((byte) 0xD8);
    }

    @Test
    @DisplayName("Rejeita texto disfarçado de PNG (extensão e content-type falsos)")
    void rejectsTextDisguisedAsImage() {
        byte[] text = "isto definitivamente nao e uma imagem".getBytes(StandardCharsets.UTF_8);
        MockMultipartFile file = new MockMultipartFile("file", "avatar.png", "image/png", text);

        assertThatThrownBy(() -> processor.process(file))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("PNG ou JPEG");
    }

    @Test
    @DisplayName("Rejeita SVG (vetor de XSS) mesmo com content-type de imagem")
    void rejectsSvg() {
        byte[] svg = ("<svg xmlns=\"http://www.w3.org/2000/svg\"><script>alert(1)</script></svg>")
                .getBytes(StandardCharsets.UTF_8);
        MockMultipartFile file = new MockMultipartFile("file", "avatar.svg", "image/svg+xml", svg);

        assertThatThrownBy(() -> processor.process(file))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("PNG ou JPEG");
    }

    @Test
    @DisplayName("Rejeita GIF — apenas PNG e JPEG são permitidos")
    void rejectsGif() throws IOException {
        byte[] gif = generateImage(32, 32, "gif");
        MockMultipartFile file = new MockMultipartFile("file", "avatar.gif", "image/gif", gif);

        assertThatThrownBy(() -> processor.process(file))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("PNG ou JPEG");
    }

    @Test
    @DisplayName("Rejeita arquivo vazio")
    void rejectsEmptyFile() {
        MockMultipartFile file = new MockMultipartFile("file", "avatar.png", "image/png", new byte[0]);

        assertThatThrownBy(() -> processor.process(file))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Nenhuma imagem");
    }

    @Test
    @DisplayName("Rejeita imagem com dimensões acima do limite (decompression bomb)")
    void rejectsOversizedDimensions() throws IOException {
        byte[] huge = generateImage(3000, 3000, "png");
        MockMultipartFile file = new MockMultipartFile("file", "avatar.png", "image/png", huge);

        assertThatThrownBy(() -> processor.process(file))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("2048");
    }

    @Test
    @DisplayName("Remove payload anexado a um PNG válido (poliglota) ao reescrever a imagem")
    void stripsAppendedPayload() throws IOException {
        byte[] png = generateImage(48, 48, "png");
        byte[] payload = "<?php system($_GET['cmd']); ?>".getBytes(StandardCharsets.UTF_8);

        byte[] polyglot = new byte[png.length + payload.length];
        System.arraycopy(png, 0, polyglot, 0, png.length);
        System.arraycopy(payload, 0, polyglot, png.length, payload.length);

        MockMultipartFile file = new MockMultipartFile("file", "avatar.png", "image/png", polyglot);

        String result = processor.process(file);
        byte[] sanitized = decodeDataUrl(result);

        assertThat(new String(sanitized, StandardCharsets.ISO_8859_1)).doesNotContain("php");
    }
}
