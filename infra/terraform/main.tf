terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# running in docker-compose network, use http://localhost:4566
provider "aws" {
  region                      = "us-west-2"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true

  endpoints {
    sqs = "http://localhost:4566"
  }
}

resource "aws_sqs_queue" "dlq" {
  name = "reddit-events-dlq"
}

resource "aws_sqs_queue" "main" {
  name = "reddit-events"

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = 5
  })
}

output "queue_url" {
  value = aws_sqs_queue.main.id
}