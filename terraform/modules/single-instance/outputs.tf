
output "aws_eip_public_dns" {
  description = "Public dns of elastic IP"
  value       = aws_eip.eip.public_dns
}

output "aws_eip_public_ip" {
  description = "Public ip of elastic IP"
  value       = aws_eip.eip.public_ip
}

output "aws_ebs_volume_id" {
  description = "EBS Volume Device Id"
  value       = aws_ebs_volume.ebs_volume.id
}
