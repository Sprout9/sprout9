
output "aws_eip_public_dns" {
  description = "Public dns of elastic IP"
  value       = aws_eip.eip.public_dns
}
