package me.gabrielporto.fintrack.backend.service;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Iterator;
import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageInputStream;
import javax.imageio.stream.ImageOutputStream;
import me.gabrielporto.fintrack.backend.exception.BusinessException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class AvatarImageProcessor {

    private static final long MAX_FILE_SIZE = 1024 * 1024;
    private static final int MAX_DIMENSION = 2048;
    private static final float JPEG_QUALITY = 0.85f;

    private static final byte[] PNG_SIGNATURE = {(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A};
    private static final byte[] JPEG_SIGNATURE = {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF};

    static {
        ImageIO.setUseCache(false);
    }

    private enum ImageFormat {
        PNG("image/png"),
        JPEG("image/jpeg");

        private final String mimeType;

        ImageFormat(String mimeType) {
            this.mimeType = mimeType;
        }

        boolean matchesReaderFormat(String readerFormatName) {
            String normalized = readerFormatName.toLowerCase();
            if (this == JPEG) {
                return normalized.equals("jpeg") || normalized.equals("jpg");
            }
            return normalized.equals("png");
        }
    }

    public String process(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("Nenhuma imagem enviada");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BusinessException("A imagem deve ter no máximo 1MB");
        }

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new BusinessException("Não foi possível ler a imagem");
        }

        ImageFormat format = detectFormat(bytes);
        BufferedImage image = decodeAndValidate(bytes, format);
        byte[] sanitized = reencode(image, format);

        return "data:" + format.mimeType + ";base64," + Base64.getEncoder().encodeToString(sanitized);
    }

    private ImageFormat detectFormat(byte[] data) {
        if (startsWith(data, PNG_SIGNATURE)) {
            return ImageFormat.PNG;
        }
        if (startsWith(data, JPEG_SIGNATURE)) {
            return ImageFormat.JPEG;
        }
        throw new BusinessException("A imagem deve ser PNG ou JPEG");
    }

    private BufferedImage decodeAndValidate(byte[] bytes, ImageFormat format) {
        try (ImageInputStream iis = ImageIO.createImageInputStream(new ByteArrayInputStream(bytes))) {
            if (iis == null) {
                throw new BusinessException("Arquivo de imagem inválido ou corrompido");
            }

            Iterator<ImageReader> readers = ImageIO.getImageReaders(iis);
            if (!readers.hasNext()) {
                throw new BusinessException("Arquivo de imagem inválido ou corrompido");
            }

            ImageReader reader = readers.next();
            try {
                reader.setInput(iis, true, true);

                if (!format.matchesReaderFormat(reader.getFormatName())) {
                    throw new BusinessException("A imagem deve ser PNG ou JPEG");
                }

                int width = reader.getWidth(0);
                int height = reader.getHeight(0);
                if (width <= 0 || height <= 0) {
                    throw new BusinessException("Arquivo de imagem inválido ou corrompido");
                }
                if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                    throw new BusinessException(
                            "A imagem deve ter no máximo " + MAX_DIMENSION + "x" + MAX_DIMENSION + " pixels");
                }

                BufferedImage image = reader.read(0);
                if (image == null) {
                    throw new BusinessException("Arquivo de imagem inválido ou corrompido");
                }
                return image;
            } finally {
                reader.dispose();
            }
        } catch (IOException e) {
            throw new BusinessException("Arquivo de imagem inválido ou corrompido");
        }
    }

    private byte[] reencode(BufferedImage source, ImageFormat format) {
        int width = source.getWidth();
        int height = source.getHeight();

        boolean png = format == ImageFormat.PNG;
        BufferedImage clean =
                new BufferedImage(width, height, png ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB);

        Graphics2D g = clean.createGraphics();
        try {
            if (!png) {
                g.setColor(Color.WHITE);
                g.fillRect(0, 0, width, height);
            }
            g.drawImage(source, 0, 0, null);
        } finally {
            g.dispose();
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            if (png) {
                if (!ImageIO.write(clean, "png", out)) {
                    throw new BusinessException("Não foi possível processar a imagem");
                }
            } else {
                writeJpeg(clean, out);
            }
        } catch (IOException e) {
            throw new BusinessException("Não foi possível processar a imagem");
        }

        return out.toByteArray();
    }

    private void writeJpeg(BufferedImage image, ByteArrayOutputStream out) throws IOException {
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpeg");
        if (!writers.hasNext()) {
            throw new BusinessException("Não foi possível processar a imagem");
        }
        ImageWriter writer = writers.next();
        try (ImageOutputStream ios = ImageIO.createImageOutputStream(out)) {
            writer.setOutput(ios);
            ImageWriteParam param = writer.getDefaultWriteParam();
            param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
            param.setCompressionQuality(JPEG_QUALITY);
            writer.write(null, new IIOImage(image, null, null), param);
        } finally {
            writer.dispose();
        }
    }

    private static boolean startsWith(byte[] data, byte[] prefix) {
        if (data.length < prefix.length) {
            return false;
        }
        for (int i = 0; i < prefix.length; i++) {
            if (data[i] != prefix[i]) {
                return false;
            }
        }
        return true;
    }
}
