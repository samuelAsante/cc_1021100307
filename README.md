# IT3230 Cloud Computing - Contact Management Application Solution

`https://cc-1021100307.vercel.app`

## 1. System Design & Architecture

### a) Cloud Service Model Used

For this Contact Management Application, I will use the **Platform as a Service (PaaS)** model. This model provides a platform allowing customers to develop, run, and manage applications without the complexity of building and maintaining the infrastructure typically associated with developing and launching an app.

### b) Cloud Deployment Model

The **Public Cloud** deployment model will be used, specifically leveraging AWS (Amazon Web Services) as the cloud provider. This offers scalability, reliability, and cost-effectiveness while eliminating the need for maintaining physical hardware.

### c) System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Contact Management App                       │
├─────────────────┬───────────────────┬───────────────────┬───────────┤
│   Frontend      │     Backend       │     Database      │  Cloud    │
│ (React.js)      │ (Node.js/Express) │  (AWS DynamoDB)   │ Services  │
├─────────────────┴───────────┬───────┴─────────┬─────────┴───────────┤
│                              │                 │                     │
│  ┌───────────────────────┐   │  ┌───────────┐ │  ┌────────────────┐ │
│  │   User Interface      │◄──┼──┤  REST API ├─┼─►│  DynamoDB      │ │
│  │   - Contact List      │   │  │  (Express)│ │  │  - Contacts    │ │
│  │   - Add/Edit Forms    │   │  └───────────┘ │  │  - Users       │ │
│  └───────────┬───────────┘   │                │  └────────────────┘ │
│              │               │                │                     │
│  ┌───────────▼───────────┐   │                │  ┌────────────────┐ │
│  │   Auth0 Authentication│   │                │  │ AWS Cognito    │ │
│  │   - Login/Logout      │◄──┼────────────────┼─►│ User Pool      │ │
│  │   - JWT Tokens        │   │                │  └────────────────┘ │
│  └───────────────────────┘   │                │                     │
│                              │                │                     │
│  ┌───────────────────────┐   │                │  ┌────────────────┐ │
│  │ Docker Container       │   │                │  │ AWS Lambda     │ │
│  │ - Frontend             │   │                │  │ (Serverless)   │ │
│  │ - Backend              │   │                │  └────────────────┘ │
│  └───────────────────────┘   │                │                     │
│                              │                │                     │
└──────────────────────────────┴────────────────┴─────────────────────┘
```

**Components and Interactions:**

1. **Frontend**: Built with React.js, hosted in a Docker container deployed to AWS ECS (Elastic Container Service)
2. **Backend**: Node.js/Express API running in Docker containers, with some functions implemented as AWS Lambda (serverless)
3. **Database**: AWS DynamoDB for NoSQL data storage
4. **Authentication**: Auth0 for frontend authentication integrated with AWS Cognito
5. **Containerization**: Docker used for both frontend and backend, with Kubernetes (AWS EKS) for orchestration if needed
6. **APIs**: RESTful API for CRUD operations, plus Auth0 and AWS API Gateway for secure endpoints

**Virtualization/Containers:**

- Docker containers package both frontend and backend components
- AWS ECS manages container deployment and scaling
- Kubernetes (AWS EKS) available for more complex orchestration needs

## 2. Implementation & Deployment

### a) CRUD Cloud-Based Application Implementation

**Tech Stack:**

- Frontend: React.js with TypeScript
- Backend: Node.js with Express
- Database: AWS DynamoDB
- Authentication: Auth0 + AWS Cognito
- Deployment: AWS ECS (Docker), AWS Lambda, AWS API Gateway

**Implementation Steps:**

1. **Project Setup**

   ```bash
   # Create project structure
   mkdir cc_indexnumber
   cd cc_indexnumber
   mkdir frontend backend docker-configs
   ```

2. **Frontend Implementation (React.js)**

   ```typescript
   // Example ContactList component
   import React, { useState, useEffect } from "react";
   import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

   const ContactList = () => {
     const [contacts, setContacts] = useState([]);
     const { getAccessTokenSilently } = useAuth0();

     useEffect(() => {
       const fetchContacts = async () => {
         const token = await getAccessTokenSilently();
         const response = await fetch("https://api.example.com/contacts", {
           headers: {
             Authorization: `Bearer ${token}`,
           },
         });
         setContacts(await response.json());
       };
       fetchContacts();
     }, []);

     return (
       <div>
         {contacts.map((contact) => (
           <ContactCard key={contact.id} contact={contact} />
         ))}
       </div>
     );
   };
   ```

3. **Backend Implementation (Node.js/Express)**

   ```javascript
   // server.js
   const express = require("express");
   const AWS = require("aws-sdk");
   const { auth } = require("express-oauth2-jwt-bearer");

   const app = express();
   const dynamoDB = new AWS.DynamoDB.DocumentClient();

   // Auth0 middleware
   const checkJwt = auth({
     audience: "https://contact-api.example.com",
     issuerBaseURL: "https://your-auth0-domain.auth0.com/",
   });

   app.get("/contacts", checkJwt, async (req, res) => {
     const params = {
       TableName: "Contacts",
       FilterExpression: "userId = :userId",
       ExpressionAttributeValues: { ":userId": req.auth.payload.sub },
     };

     try {
       const data = await dynamoDB.scan(params).promise();
       res.json(data.Items);
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   });

   module.exports = app;
   ```

4. **Docker Configuration**

   ```dockerfile
   # frontend/Dockerfile
   FROM node:16
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]

   # backend/Dockerfile
   FROM node:16
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 8080
   CMD ["node", "server.js"]
   ```

5. **AWS Deployment**
   - Create ECR repositories for frontend and backend
   - Build and push Docker images
   - Create ECS cluster and task definitions
   - Configure Application Load Balancer
   - Set up DynamoDB tables with proper IAM roles
   - Configure API Gateway with Lambda integration

### b) System Components Implementation

1. **Frontend**

   - React.js with TypeScript
   - Auth0 for authentication
   - Axios for API calls
   - Material-UI for UI components
   - Docker containerization

2. **Backend**

   - Node.js with Express
   - AWS SDK for DynamoDB access
   - Auth0 JWT validation
   - Serverless functions for specific operations
   - Docker containerization

3. **Database**

   - AWS DynamoDB tables:
     - Contacts (partition key: userId, sort key: contactId)
     - Users (partition key: userId)

4. **Cloud Services**
   - AWS ECS for container orchestration
   - AWS Lambda for serverless functions
   - AWS API Gateway for REST endpoints
   - AWS Cognito for user management
   - AWS CloudFront for CDN

### c) Deployment to AWS

1. **Infrastructure as Code (AWS CDK)**

   ```typescript
   // lib/contact-app-stack.ts
   import * as cdk from "@aws-cdk/core";
   import * as ecs from "@aws-cdk/aws-ecs";
   import * as ec2 from "@aws-cdk/aws-ec2";

   export class ContactAppStack extends cdk.Stack {
     constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
       super(scope, id, props);

       const vpc = new ec2.Vpc(this, "ContactAppVpc", { maxAzs: 2 });

       const cluster = new ecs.Cluster(this, "ContactAppCluster", { vpc });

       // Frontend task definition
       const frontendTask = new ecs.FargateTaskDefinition(
         this,
         "FrontendTask",
         {
           memoryLimitMiB: 512,
           cpu: 256,
         }
       );

       frontendTask.addContainer("FrontendContainer", {
         image: ecs.ContainerImage.fromEcrRepository(frontendRepo),
         portMappings: [{ containerPort: 3000 }],
       });

       // Backend service
       // Similar configuration for backend
     }
   }
   ```

### d) Virtualization with Docker and Kubernetes

1. **Docker Compose (for local development)**

   ```yaml
   version: "3.8"
   services:
     frontend:
       build: ./frontend
       ports:
         - "3000:3000"
       environment:
         - REACT_APP_API_URL=http://backend:8080
     backend:
       build: ./backend
       ports:
         - "8080:8080"
       environment:
         - AWS_REGION=us-east-1
         - DYNAMODB_TABLE=Contacts
   ```

2. **Kubernetes Deployment (AWS EKS)**
   ```yaml
   # frontend-deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: frontend
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: frontend
     template:
       metadata:
         labels:
           app: frontend
       spec:
         containers:
           - name: frontend
             image: your-account.dkr.ecr.region.amazonaws.com/frontend:latest
             ports:
               - containerPort: 3000
   ```

### e) Cloud API Integration

1. **Auth0 Authentication**

   ```javascript
   // frontend/src/index.js
   import React from "react";
   import { Auth0Provider } from "@auth0/auth0-react";

   ReactDOM.render(
     <Auth0Provider
       domain='your-auth0-domain.auth0.com'
       clientId='your-client-id'
       redirectUri={window.location.origin}
       audience='https://contact-api.example.com'
     >
       <App />
     </Auth0Provider>,
     document.getElementById("root")
   );
   ```

2. **AWS SDK Configuration**

   ```javascript
   // backend/aws-config.js
   const AWS = require("aws-sdk");

   AWS.config.update({
     region: process.env.AWS_REGION,
     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
   });

   module.exports = AWS;
   ```

### f) Cloud Database Implementation

1. **DynamoDB Table Design**

   ```javascript
   // backend/database.js
   const AWS = require("./aws-config");
   const dynamoDB = new AWS.DynamoDB.DocumentClient();

   const createContact = async (contact) => {
     const params = {
       TableName: process.env.DYNAMODB_TABLE,
       Item: {
         userId: contact.userId,
         contactId: `${Date.now()}`,
         ...contact,
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
       },
     };

     return dynamoDB.put(params).promise();
   };
   ```

## 3. Testing & Performance Optimization (4 Marks)

### a) Testing Approach

1. **Unit Testing**

   - Jest for frontend components
   - Mocha/Chai for backend API tests

2. **Integration Testing**

   - Postman collection for API testing
   - Cypress for end-to-end frontend testing

3. **Performance Testing**

   - Load testing with Artillery

   ```yaml
   # artillery.yml
   config:
     target: "https://api.example.com"
     phases:
       - duration: 60
         arrivalRate: 10
   scenarios:
     - flow:
         - get:
             url: "/contacts"
   ```

4. **Security Testing**
   - OWASP ZAP for security scanning
   - npm audit for dependency vulnerabilities

### b) Failure Handling and Dynamic Scaling

1. **Failure Handling**

   - Implemented retry logic with exponential backoff
   - Circuit breakers for API calls
   - Dead letter queues for failed processing
   - Multi-AZ deployment for high availability

2. **Dynamic Scaling**
   - AWS ECS auto-scaling based on CPU/memory utilization
   - DynamoDB auto-scaling for read/write capacity
   - Lambda concurrency limits for serverless functions
   - CloudWatch alarms for performance metrics

## 4. Documentation & Presentation (15 Marks)

### a) Project Report Structure

1. **Technical Documentation**

   - System architecture overview
   - Technology choices and justification
   - API documentation (Swagger/OpenAPI)
   - Deployment process

2. **System Architecture Diagram**

   - Detailed component diagram (as shown in section 1)
   - Data flow diagram
   - Security architecture

3. **Methodology**

   - Agile development approach
   - CI/CD pipeline (GitHub Actions)
   - Testing strategy

4. **Testing Report**
   - Unit test coverage (aim for 80%+)
   - Performance test results
   - Security testing findings and mitigations
   - Load testing metrics (requests/sec, error rates)

### Example README.md

```markdown
# Contact Management Application

## Project Overview

Cloud-based contact management system with secure authentication and CRUD operations.

## Technologies

- Frontend: React.js, TypeScript, Material-UI
- Backend: Node.js, Express
- Database: AWS DynamoDB
- Infrastructure: AWS ECS, Lambda, API Gateway
- Security: Auth0, AWS Cognito

## Setup

1. Clone repository
2. Configure environment variables
3. Run `docker-compose up` for local development

## Deployment

1. Build Docker images
2. Push to AWS ECR
3. Deploy with AWS CDK

## API Documentation

See `API.md` for detailed endpoint documentation

## Testing

Run tests with:

- `npm test` (frontend)
- `npm run test` (backend)
```

## Submission Requirements

1. **GitHub Repository**

   - Private repository named `cc_indexnumber`
   - Proper directory structure
   - Comprehensive README
   - All source code
   - Documentation files

2. **Deployed Solution**

   - AWS ECS hosted frontend URL
   - API Gateway endpoint
   - Working demo credentials (if applicable)

3. **Invitation**

   - Invite `godwin.danso@acity.edu.gh` as collaborator
   - Or invite GitHub user `GodwinDansoAcity`

4. **Email Submission**
   - Send email to `godwin.danso@acity.edu.gh` with:
     - GitHub repository link
     - Deployed application URL
     - Samyel Owusu Asante and i10211100307 in subject

This solution provides a comprehensive, secure, and scalable contact management application leveraging modern cloud computing technologies and best practices. The architecture is designed for high availability, security, and performance while maintaining cost-effectiveness through serverless components and auto-scaling capabilities.
