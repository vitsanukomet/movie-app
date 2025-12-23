#!/bin/bash
# ==============================================================================
# Movie App - AWS CloudFormation Deployment Script
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
STACK_NAME="movie-app-stack"
TEMPLATE_FILE="movie-app-template.yaml"
REGION="${AWS_REGION:-ap-southeast-1}"

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   Movie App - CloudFormation Deploy${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    echo "Please install AWS CLI: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if template file exists
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo -e "${RED}Error: Template file not found: $TEMPLATE_FILE${NC}"
    exit 1
fi

# Prompt for parameters
echo -e "${YELLOW}Please provide the following parameters:${NC}"
echo ""

read -p "EC2 Key Pair Name: " KEY_NAME
read -p "Git Repository URL: " APP_REPO_URL
read -p "Database Username [movieadmin]: " DB_USERNAME
DB_USERNAME=${DB_USERNAME:-movieadmin}

read -sp "Database Password (min 8 chars): " DB_PASSWORD
echo ""

read -sp "JWT Secret: " JWT_SECRET
echo ""

echo ""
echo -e "${YELLOW}Deploying CloudFormation stack...${NC}"
echo "Stack Name: $STACK_NAME"
echo "Region: $REGION"
echo ""

# Deploy CloudFormation stack
aws cloudformation deploy \
    --template-file "$TEMPLATE_FILE" \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --parameter-overrides \
        KeyName="$KEY_NAME" \
        AppRepoUrl="$APP_REPO_URL" \
        DBUsername="$DB_USERNAME" \
        DBPassword="$DB_PASSWORD" \
        JwtSecret="$JWT_SECRET" \
    --capabilities CAPABILITY_NAMED_IAM \
    --no-fail-on-empty-changeset

echo ""
echo -e "${GREEN}Deployment completed!${NC}"
echo ""

# Get outputs
echo -e "${YELLOW}Stack Outputs:${NC}"
aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[*].[OutputKey, OutputValue]' \
    --output table

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   Deployment Successful!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Your application will be available at the ALBDNSName URL above."
echo "Note: It may take 5-10 minutes for the instances to fully initialize."
echo ""
echo "To check instance status:"
echo "  aws ec2 describe-instances --filters 'Name=tag:Name,Values=movie-app-app-server'"
echo ""
echo "To delete the stack:"
echo "  aws cloudformation delete-stack --stack-name $STACK_NAME --region $REGION"

