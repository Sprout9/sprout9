resource "aws_security_group" "security-group" {
  name        = "${var.name}-sec-group"
  description = "Security group for ${var.name}"

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
    from_port   = 0
    to_port     = 0
    protocol    = "all"
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

# Manual Step, mount EBS: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-using-volumes.html
resource "aws_volume_attachment" "ebs_attachment" {
  device_name = "/dev/sdf"
  volume_id   = aws_ebs_volume.ebs_volume.id
  instance_id = aws_instance.single_instance.id
}

resource "aws_instance" "single_instance" {
  ami                         = var.ami
  instance_type               = var.instance_type
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

