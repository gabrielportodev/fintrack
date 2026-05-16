package me.gabrielporto.fintrack.backend.service;

import lombok.RequiredArgsConstructor;

import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;


@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${resend.api.key}")
    private String resendApiKey;

    private final WebClient webClient = WebClient.create("https://api.resend.com");

    public void sendPasswordResetCode(String email, String code) {
        Map<String, Object> body = Map.of(
            "from", "Fintrack <contact@send.gabrielporto.me>",
            "to", email,
            "subject", "Fintrack — Código de redefinição de senha",
            "html", buildEmailBody(code)
        );

        try {
            webClient.post()
                .uri("/emails")
                .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                .header("Authorization", "Bearer " + resendApiKey)
                .bodyValue(Objects.requireNonNull(body))
                .retrieve()
                .bodyToMono(String.class)
                .block();
        } catch (WebClientResponseException e) {
            throw new RuntimeException("Erro ao enviar email: " + e.getResponseBodyAsString(), e);
        }
    }

    private String buildEmailBody(String code) {
        return """
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </head>
            <body style="margin:0;padding:0;background-color:#0F1117;font-family:Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0" style="background-color:#0F1117;padding:40px 0;">
                <tr>
                  <td align="center">
                    <table width="480" cellpadding="0" cellspacing="0"
                           style="background-color:#1A1D27;border-radius:12px;overflow:hidden;border:1px solid #2D3048;">

                      <!-- Header -->
                      <tr>
                        <td style="background-color:#6366F1;padding:28px 40px;">
                          <p style="margin:0;font-size:22px;font-weight:bold;color:#ffffff;letter-spacing:-0.5px;">
                            Fintrack
                          </p>
                          <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.7);">
                            Controle financeiro pessoal
                          </p>
                        </td>
                      </tr>

                      <!-- Body -->
                      <tr>
                        <td style="padding:36px 40px;">
                          <p style="margin:0 0 8px;font-size:20px;font-weight:bold;color:#F8FAFC;">
                            Redefinição de senha
                          </p>
                          <p style="margin:0 0 28px;font-size:14px;color:#94A3B8;line-height:1.6;">
                            Recebemos uma solicitação para redefinir a senha da sua conta.
                            Use o código abaixo para continuar. Ele é válido por
                            <strong style="color:#F8FAFC;">15 minutos</strong>.
                          </p>

                          <!-- Código -->
                          <table width="100%%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td align="center"
                                  style="background-color:#0F1117;border:1px solid #2D3048;
                                         border-radius:10px;padding:24px;">
                                <p style="margin:0 0 6px;font-size:12px;color:#94A3B8;
                                          letter-spacing:2px;text-transform:uppercase;">
                                  Seu código
                                </p>
                                <p style="margin:0;font-size:38px;font-weight:bold;
                                          color:#6366F1;letter-spacing:10px;">
                                  %s
                                </p>
                              </td>
                            </tr>
                          </table>

                          <p style="margin:28px 0 0;font-size:13px;color:#94A3B8;line-height:1.6;">
                            Se você não solicitou a redefinição de senha, ignore este email.
                            Sua senha permanecerá a mesma e nenhuma alteração será feita.
                          </p>
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr>
                        <td style="padding:0 40px;">
                          <div style="height:1px;background-color:#2D3048;"></div>
                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="padding:24px 40px;">
                          <p style="margin:0;font-size:12px;color:#64748B;line-height:1.6;">
                            Este é um email automático, não responda.
                            <br/>
                            &copy; %s Fintrack &mdash;
                            <a href="https://fintrack.gabrielporto.me"
                               style="color:#6366F1;text-decoration:none;">
                              fintrack.gabrielporto.me
                            </a>
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
            """.formatted(code, java.time.Year.now().getValue());
    }
}