
output "aws_ami_name" {
  description = "Amazon Machine Image (AMI) Name"
  value       = data.aws_ami.debian.name
}

# output "aws_eip_public_dns" {
#   description = "Instance EIP Public DNS"
#   value       = module.forms.aws_eip_public_dns
# }
