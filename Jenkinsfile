pipeline {
    agent any
    tools {
        nodejs 'node20'
    }
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        APP_NAME = "nodejs-devops-project"
        IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKER_USER = "maheshjadhav7822"
    }
    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }
        stage('Checkout from GitHub') {
            steps {
                git branch: 'main',
                credentialsId: 'github',
                url: 'https://github.com/maheshjadhav07822/nodejs-devops-project.git'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh '''$SCANNER_HOME/bin/sonar-scanner \
                    -Dsonar.projectName=NodejsApp \
                    -Dsonar.projectKey=NodejsApp'''
                }
            }
        }
        stage('Quality Gate') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false,
                    credentialsId: 'sonar-token'
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Trivy FS Scan') {
            steps {
                sh 'trivy fs . > trivyfs.txt'
            }
        }
        stage('Docker Build and Push') {
    steps {
        script {
            withDockerRegistry(credentialsId: 'docker', url: 'https://index.docker.io/v1/') {
                sh "docker build -t ${APP_NAME}:${IMAGE_TAG} ."
                sh "docker tag ${APP_NAME}:${IMAGE_TAG} ${DOCKER_USER}/${APP_NAME}:${IMAGE_TAG}"
                sh "docker push ${DOCKER_USER}/${APP_NAME}:${IMAGE_TAG}"
            }
        }
    }
}
        stage('Trivy Image Scan') {
            steps {
                sh "trivy image \
                ${DOCKER_USER}/${APP_NAME}:${IMAGE_TAG} > trivy.txt"
            }
        }
       stage('Debug Agent') {
    steps {
        sh '''
        echo "Hostname:"
        hostname

        echo "User:"
        whoami

        echo "PATH:"
        echo $PATH

        echo "kubectl:"
        which kubectl || true

        ls -l /usr/local/bin/kubectl || true

        kubectl version --client || true
        '''
    }
}
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withKubeConfig(
                    credentialsId: 'k8s') {
                        sh '/usr/local/bin/kubectl apply -f kubernetes/namespace.yaml'
                        sh '/usr/local/bin/kubectl apply -f kubernetes/configmap.yaml'
                        sh '/usr/local/bin/kubectl apply -f kubernetes/secret.yaml'
                        sh '/usr/local/bin/kubectl apply -f kubernetes/deployment.yaml'
                        sh '/usr/local/bin/kubectl apply -f kubernetes/service.yaml'
                        sh '/usr/local/bin/kubectl apply -f kubernetes/ingress.yaml'
                        sh '/usr/local/bin/kubectl apply -f kubernetes/hpa.yaml'
                    }
                }
            }
        }
    }
    post {
        success {
            echo 'Pipeline completed successfully! ✅'
        }
        failure {
            echo 'Pipeline failed! ❌'
        }
    }
}
