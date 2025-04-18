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
    }
}
