pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Docker Diagnostics') {
            steps {
                bat 'docker info'
                bat 'docker version'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
            post {
                always {
                    junit 'reports/junit.xml'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                bat 'docker build -t gestion-tareas-api:%BUILD_NUMBER% .'
                bat 'docker tag gestion-tareas-api:%BUILD_NUMBER% gestion-tareas-api:latest'
            }
        }
        
        stage('Run Docker Container') {
            steps {
                
                // Ejecutar el nuevo contenedor con manejo de errores
                bat '''
                    echo "Detener y eliminar contenedor existente si existe..."
                    docker stop gestion-tareas-api || echo "No hay contenedor para detener"
                    docker rm gestion-tareas-api || echo "No hay contenedor para eliminar"
                    echo "Intentando ejecutar el contenedor Docker..."
                    docker run -d --name gestion-tareas-api -p 3000:3000 gestion-tareas-api:latest
                '''
                // Verificar que el contenedor está en ejecución
                bat '''
                    echo "Verificando estado del contenedor..."
                    docker ps | findstr gestion-tareas-api || (
                        echo "El contenedor no está en ejecución. Mostrando logs:"
                        docker logs gestion-tareas-api
                        exit 1
                    )
                '''
            }
        }
        
        stage('Verify Docker Container') {
            steps {
                // Mostrar logs del contenedor
                bat 'docker logs gestion-tareas-api'
                
                // Verificar el estado del contenedor
                bat 'docker ps -a | findstr gestion-tareas-api'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline ejecutado exitosamente!'
        }
        failure {
            echo 'El pipeline ha fallado.'
            bat '''
                echo "Mostrando información de diagnóstico:"
                docker ps -a
                docker images
                echo "Logs del contenedor (si existe):"
                docker logs gestion-tareas-api || echo "No se pueden obtener logs"
            '''
        }
        always {
            echo 'Generando reporte...'
            bat 'if not exist reports mkdir reports'
            bat 'echo Build Number: %BUILD_NUMBER% > reports\\build-info.txt'
            bat 'echo Build Status: %currentBuild.result% >> reports\\build-info.txt'
            bat 'echo Build URL: %BUILD_URL% >> reports\\build-info.txt'
            bat 'docker images > reports\\docker-images.txt || echo "No se pueden listar imágenes" > reports\\docker-images.txt'
            bat 'docker ps -a > reports\\docker-containers.txt || echo "No se pueden listar contenedores" > reports\\docker-containers.txt'
            archiveArtifacts artifacts: 'reports/*', fingerprint: true
        }
    }
}
