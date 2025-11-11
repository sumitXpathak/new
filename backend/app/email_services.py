import os
import smtplib
from email.message import EmailMessage
from email.utils import formataddr
from textwrap import dedent
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "").strip()
        self.smtp_port = int(os.getenv("SMTP_PORT", "0"))
        self.sender_email = os.getenv("SENDER_EMAIL", "").strip()
        self.sender_password = os.getenv("SENDER_PASSWORD", "").strip()
        self.admin_email = os.getenv("ADMIN_EMAIL", self.sender_email).strip()

        missing = [k for k, v in {
            "SMTP_SERVER": self.smtp_server,
            "SMTP_PORT": self.smtp_port,
            "SENDER_EMAIL": self.sender_email,
            "SENDER_PASSWORD": self.sender_password,
        }.items() if not v]
        if missing:
            raise RuntimeError(f"EmailService misconfigured. Missing env(s): {', '.join(missing)}")

        if self.smtp_port not in (465, 587):
            raise RuntimeError("SMTP_PORT must be 465 (SSL) or 587 (STARTTLS).")

    def _connect_and_login(self):
        if self.smtp_port == 465:
            server = smtplib.SMTP_SSL(self.smtp_server, self.smtp_port, timeout=30)
        else:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port, timeout=30)
            server.ehlo()
            server.starttls()
        server.login(self.sender_email, self.sender_password)
        return server

    def _send(self, to_email: str, subject: str, body: str):
        msg = EmailMessage()
        msg["From"] = formataddr(("Portfolio", self.sender_email))
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.set_content(body)

        with self._connect_and_login() as server:
            server.send_message(msg)

    def send_contact_notification(self, contact_data: dict) -> bool:
        try:
            to_email = self.admin_email
            if not to_email or not isinstance(to_email, str):
                raise ValueError("Missing or invalid admin email address.")

            body = dedent(f"""
                New contact form submission:

                Name:    {contact_data.get('name')}
                Email:   {contact_data.get('email')}
                Subject: {contact_data.get('subject', 'No subject')}

                Message:
                {contact_data.get('message')}
            """).strip()

            self._send(to_email, f"New Contact: {contact_data.get('name')}", body)
            print(f"[email] Notification sent to {to_email}")
            return True
        except (smtplib.SMTPAuthenticationError, ValueError) as e:
            print(f"[email] Auth or validation failed: {e}")
            return False
        except Exception as e:
            print(f"[email] Send error: {e}")
            return False

    def send_auto_reply(self, contact_data: dict) -> bool:
        try:
            to_email = contact_data.get('email')
            if not to_email or not isinstance(to_email, str):
                raise ValueError("Missing or invalid recipient email address.")

            body = dedent(f"""
                Hi {contact_data.get('name')},

                Thanks for reaching out. I received your message and will get back to you soon.

                Your message:
                {contact_data.get('message')}

                — Portfolio
            """).strip()

            self._send(to_email, "Thanks for contacting me", body)
            print(f"[email] Auto-reply sent to {to_email}")
            return True
        except (smtplib.SMTPAuthenticationError, ValueError) as e:
            print(f"[email] Auth or validation failed: {e}")
            return False
        except Exception as e:
            print(f"[email] Send error: {e}")
            return False

# Example usage
# email_service = EmailService()
# contact_data = {
#     "name": "John Doe",
#     "email": "john@example.com",
#     "subject": "Hello",
#     "message": "Just wanted to say hi!"
# }
# email_service.send_contact_notification(contact_data)
# email_service.send_auto_reply(contact_data)
