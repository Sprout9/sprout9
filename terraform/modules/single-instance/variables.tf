variable "instance_type" {
  type        = string
  description = "AWS EC2 instance type"
}

variable "ami" {
  type        = string
  description = "Amazon Machine Image (AMI) ID"
}

variable "name" {
  type        = string
  description = "Name of the instance"
}

variable "region" {
  type        = string
  description = "AWS Availability Zone (AZ) Region"
}

variable "volume_size" {
  type        = number
  description = "Size of storage volume in GiBs"
}

variable "public_key" {
  type        = string
  description = "Public key"
}
