# resource "aws_vpc" "vpc" {
#   cidr_block           = "10.0.0.0/16"
#   enable_dns_support   = true
#   enable_dns_hostnames = true
#   tags = {
#     Name = "${var.name}-vpc"
#   }
# }

# resource "aws_internet_gateway" "internet_gateway" {
#   vpc_id = aws_vpc.vpc.id
# }

# resource "aws_subnet" "subnet" {
#   vpc_id            = aws_vpc.vpc.id
#   cidr_block        = "10.0.1.0/24"
#   availability_zone = "${var.region}a"
#   # map_public_ip_on_launch = true

#   tags = {
#     Name = "${var.name}-subnet"
#   }

#   depends_on = [aws_internet_gateway.internet_gateway]
# }

resource "aws_security_group" "security-group" {
  name        = "${var.name}-sec-group"
  description = "Security group for ${var.name}"
  # vpc_id      = aws_vpc.vpc.id


  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.name}-security-group"
  }
}

resource "aws_key_pair" "public_key" {
  key_name   = "key_pair_pub"
  public_key = var.public_key
}

resource "aws_ebs_volume" "ebs_volume" {
  availability_zone = "${var.region}b"
  size              = var.volume_size
}

resource "aws_volume_attachment" "ebs_attachment" {
  device_name = "/dev/xvda"
  volume_id   = aws_ebs_volume.ebs_volume.id
  instance_id = aws_instance.single_instance.id
}

resource "aws_instance" "single_instance" {
  ami           = var.ami
  instance_type = var.instance_type
  # subnet_id                   = aws_subnet.subnet.id
  # vpc_security_group_ids = [aws_security_group.security-group.id]
  security_groups             = [aws_security_group.security-group.name]
  associate_public_ip_address = true

  key_name = aws_key_pair.public_key.key_name

  tags = {
    Name = "${var.name}-instance"
  }
}

resource "aws_eip" "eip" {
  instance = aws_instance.single_instance.id
}

# resource "aws_eip" "eip" {
#   domain     = "vpc"
#   instance   = aws_instance.single_instance.id
#   depends_on = [aws_internet_gateway.internet_gateway]
# }
