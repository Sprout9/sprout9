
output "aws_eip_public_dns" {
  description = "Public dns of elastic IP"
  value       = aws_eip.eip.public_dns
}

output "aws_eip_public_ip" {
  description = "Public ip of elastic IP"
  value       = aws_eip.eip.public_ip
}
