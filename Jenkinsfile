pipeline {
    agent any

    environment {
        IMAGE = "secure-health-app:${BUILD_NUMBER}"
    }

    stages {

        stage('Clone Code') {
            steps {
                git 'https://github.com/YOUR_USERNAME/secure-health-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Basic Security Check') {
            steps {
                sh '''
                echo "🔍 Checking for hardcoded secrets..."

                if grep -r "password" .; then
                    echo "⚠️ Warning: Possible hardcoded secret found!"
                else
                    echo "✅ No obvious secrets found"
                fi
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE .'
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh '''
                echo "🔐 Running Trivy scan..."

                trivy image --severity HIGH,CRITICAL $IMAGE || true
                '''
            }
        }

        stage('Deploy Secure App') {
            steps {
                sh '''
                echo "🚀 Deploying secure-health-app..."

                docker stop secure-health || true
                docker rm secure-health || true

                docker run -d -p 8015:3000 \
                --name secure-health \
                $IMAGE
                '''
            }
        }
    }

    post {
        success {
            echo "✅ DevSecOps Pipeline Completed Successfully!"
        }
        failure {
            echo "❌ Pipeline Failed! Check security or deployment issues."
        }
    }
}