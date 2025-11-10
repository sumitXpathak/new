import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.sender_email = os.getenv("SENDER_EMAIL")
        self.sender_password = os.getenv("SENDER_PASSWORD")
        self.admin_email = os.getenv("ADMIN_EMAIL", self.sender_email)
    
    async def send_contact_notification(self, contact_data):
        """Send email notification to admin when someone submits contact form"""
        try:
            # Create message
            message = MIMEMultipart()
            message["From"] = self.sender_email
            message["To"] = self.admin_email
            message["Subject"] = f"New Contact Form Submission from {contact_data['name']}"
            
            # Email body
            body = f"""
            New contact form submission received:
            
            Name: {contact_data['name']}
            Email: {contact_data['email']}
            Subject: {contact_data.get('subject', 'No subject')}
            
            Message:
            {contact_data['message']}
            
            ---
            This message was sent from your portfolio website contact form.
            """
            
            message.attach(MIMEText(body, "plain"))
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)
            
            print(f"Contact notification email sent to {self.admin_email}")
            return True
            
        except Exception as e:
            print(f"Failed to send email: {str(e)}")
            return False
    
    async def send_auto_reply(self, contact_data):
        """Send auto-reply to the person who submitted the form"""
        try:
            message = MIMEMultipart()
            message["From"] = self.sender_email
            message["To"] = contact_data['email']
            message["Subject"] = "Thank you for contacting me!"
            
            body = f"""
            Hi {contact_data['name']},
            
            Thank you for reaching out through my portfolio website. I have received your message and will get back to you as soon as possible.
            
            Here's a copy of your message:
            {contact_data['message']}
            
            Best regards,
            Alex Johnson
            Full-Stack Developer
            """
            
            message.attach(MIMEText(body, "plain"))
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)
            
            print(f"Auto-reply sent to {contact_data['email']}")
            return True
            
        except Exception as e:
            print(f"Failed to send auto-reply: {str(e)}")
            return False

# Create global email service instance
email_service = EmailService() 