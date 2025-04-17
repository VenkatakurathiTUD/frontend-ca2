pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'venkatakurathi/frontend-ca2:latest'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/VenkatakurathiTUD/frontend-ca2.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install'
                }
            }
        }

        stage('Build Application') {
            steps {
                script {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE} ."
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh '''
                    kubectl set image deployment/frontend frontend=venkatakurathi/frontend-ca2:latest --record
                    kubectl rollout status deployment/frontend
                    '''
                }
            }
        }
    }
}
