
output "aws_ami_name" {
  description = "Amazon Machine Image (AMI) Name"
  value       = data.aws_ami.debian.id
}

output "aws_eip_public_dns" {
  description = "Instance EIP Public DNS"
  value       = module.forms.aws_eip_public_dns
}

output "aws_eip_public_ip" {
  description = "Public ip of elastic IP"
  value       = module.forms.aws_eip.eip.public_ip
}
