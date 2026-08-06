output "ec2_public_ip" {
  value = aws_instance.forme_ec2.public_ip
}
output "frontend_url" {
  value = "http://${aws_instance.forme_ec2.public_ip}:3000"
}
output "backend_url" {
  value = "http://${aws_instance.forme_ec2.public_ip}:5000"
}
