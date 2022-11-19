---
title: jenkins
date: 2022-06-21
tags: 
- 运维

categories:

- 软件工程
---



## 简介

软件的工程化借鉴了工作流等管理模式，软件过程高效地第一步是提高正向工作流的效率。jenkins实现了部署上高效地工作流，借助jenkins自动化来代替原本手工的重复部署操作。



jenkins主要有以下几个概念：

- 流水线
- 阶段
- 步骤
- 钩子

```tex
pipeline {
    agent {
        docker {
            image 'node:6-alpine'
            args '-p 3000:3000'
        }
    }
    environment { 
        CI = 'true'
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh './jenkins/scripts/test.sh'
            }
        }
        stage('Deliver') { 
            steps {
                sh './jenkins/scripts/deliver.sh' 
                input message: 'Finished using the web site? (Click "Proceed" to continue)' 
                sh './jenkins/scripts/kill.sh' 
            }
        }
    }
}
```



## 使用流程

- 安装jenkins
- 创建流水线项目
  - new item
  - enter an item name、描述等基本信息
  - git信息
- 创建对应的配置文件jenkinsfile

- 验证





































