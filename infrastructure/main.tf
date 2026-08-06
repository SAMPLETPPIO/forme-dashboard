provider "aws" {
  region = var.region
}

# Use existing default VPC to keep it simple and free
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_security_group" "forme_sg" {
  name = "forme-dashboard-sg"
  description = "Allow SSH, HTTP, App ports"
  vpc_id = data.aws_vpc.default.id

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port = 3000
    to_port = 3000
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port = 5000
    to_port = 5000
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "forme_ec2" {
  ami = "ami-03f4878755434977f" # Ubuntu 22.04 ap-south-1
  instance_type = var.instance_type
  key_name = var.key_name
  subnet_id = data.aws_subnets.default.ids[0]
  vpc_security_group_ids = [aws_security_group.forme_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              apt-get update -y
              apt-get install -y docker.io git
              systemctl start docker
              systemctl enable docker
              usermod -aG docker ubuntu
              curl -SL https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
              chmod +x /usr/local/bin/docker-compose
              cd /home/ubuntu
              git clone https://github.com/SAMPLETPPIO/forme-dashboard.git
              cd forme-dashboard
              cat >.env <<EENV
              POSTGRES_USER=forme
              POSTGRES_PASSWORD=forme123
              POSTGRES_DB=forme_db
              DATABASE_URL=postgres://forme:forme123@db:5432/forme_db
              EENV
              docker-compose up -d || docker compose up -d
              EOF

  tags = {
    Name = "forme-dashboard-terraform"
  }
}
