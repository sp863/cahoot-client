# Cahoot Client
- [배포 URL](https://cahoot.netlify.app/)

## Installation

```sh
npm install
npm start
// environment variables not included
```

## Motivation
이전 회사에서 계약서 서명 시 업무 담당자와 직접 만나 서면으로 진행을 했었습니다. 이때 디지털 서명이 활성화되어 있다면 얼마나 편리할까라는 생각을 했었고 이에 다음과 같은 프로젝트를 기획하게 되었습니다. 또한, 최근 IT업계에서는 외국 개발자들과의 협업을 늘려나가고 있는 추세입니다. 이러한 트렌드에 맞춰 외국 개발자 및 업체들과 계약을 체결하고 프로젝트 협업을 할 수 있는 서비스를 만들고자 노력했습니다.

대한민국 민법, 전자서명법 3조, 전자 문서 및 전자거래 기본법 4조에 부합하는 디지털 서명 기능 구현을 시도해 보았습니다. 중요 포인트는 2가지입니다.

1. 전자문서의 내용을 열람할 수 있음
2. 전자문서가 작성, 변환되거나 송신, 수신 또는 저장된 때의 형태 또는 그와 같이 재현될 수 있는 형태로 보존되어 있음

## Tech Stack

### Frontend
- React.js, React-Router-Dom, React Query, Canvas API, face-api.js (TensorFlow), Socket.io, Styled-Components
### Backend
- Node.js, Express, Socket.io, MongoDB, Mongoose, jwt, nodemailer, pdf-lib, Google Cloud Translate API, AWS S3, AWS Elastic Beanstalk

## Features

1. Digital Signature
   - PDF 파일을 업로드 하여 원하는 위치를 상자로 그리고 서명한 후 열람 및 다운로드를 할 수 있습니다.
   - 서명 전 문서를 Zoom 하고 Pan 하여 서명 위치를 파악 할 수 있습니다.
   - ![01_sign_form](https://user-images.githubusercontent.com/61281531/184476788-f8579d3c-ed0e-4eb8-98bc-379a23dcd0d9.gif)
2. Face ID
   - Face ID를 등록하여 서명 전 Face ID를 이용하여 본인 인증이 되어야지만 서명을 할 수 있습니다.
   - ![02_faceID_register](https://user-images.githubusercontent.com/61281531/184477086-8fea891c-ef43-49e7-98ec-100ecb1f9597.gif)
   - ![03_faceID_verify](https://user-images.githubusercontent.com/61281531/184477114-afce941c-925a-463d-a9a0-85ceea5dfc20.gif)
3. Chat Translation
   - 프로젝트 내 팀원들과 채팅을 할 수 있고 채팅 메세지를 즉시 번역하여 확인 할 수 있습니다.
   - ![2022-08-13 17 41 22 4](https://user-images.githubusercontent.com/61281531/184476400-b452ce83-b1aa-4a1c-bf30-0f8572a46c22.gif)
4. Task Management
   - Task를 생성하고 Task 담당자를 지정하여 관리 할 수 있습니다.
   - ![2022-08-13 17 41 22 5](https://user-images.githubusercontent.com/61281531/184476481-92a2c9af-1ef7-4643-ad29-2f85d5065449.gif)
5. Email Invitation
   - 이메일을 통하여 사용자에게 프로젝트 access 권한을 부여 할 수 있습니다.
   - ![2022-08-13 17 41 22 6](https://user-images.githubusercontent.com/61281531/184476505-3b2fdfef-2a41-45ff-8f7e-d248439a1ae7.gif)


## General Issues
- 로컬에서와 달리 AWS Elastic Beanstalk 배포 후 파일 업로드 과정에서 413 Reqeust Entity Too Large 에러가 발생하였습니다. 많은 자료들을 찾아본 결과 PDF 파일과 함께 문서 이미지 파일들을 업로드하였기에 nginx 설정값증 client에서 요청할 수 있는 기본 제한 용량을 초과하였던 것이 원인이었습니다. nginx 설정을 변경하기 위해 Elastic Beanstalk에 업로드되는 애플리케이션 패키지 내 [AWS 공식문서](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/platforms-linux-extend.html)에서 알려주는 경로에 nginx 설정 파일(myconf.conf)을 추가하였습니다. 이를 통해 최대 용량을 100MB로 변경할 수 있었고 성공적으로 문서 양식을 업로드할 수 있었습니다.

## Challenges

### PDF 문서를 이미지화하여 편집하는 기능

- 보통 PDF 파일이나 문서는 Acrobat Reader라는 프로그램으로 다양한 편집을 할 수 있으며, 상기 프로그램은 PDF의 텍스트 편집 및 전자 서명을 할 수 있는 다양한 기능을 제공합니다. 하지만 실제 제 경험상 현업에서는 자사의 법무팀에서 만든 계약서 양식을 출력하여 사용하였고 이를 PDF 형식에 맞추어 만드는 경우는 드물었습니다. 때문에 이번 프로젝트에서는 출력물을 스캔 한 파일, word 등 다양한 문서 양식을 PDF 화하여 편집할 수 있으며 여기에 추가적으로 전자 서명을 원하는 위치에 편집이 가능하도록 구현하였습니다.
- 이런 PDF 편집 기능을 구현하면서 제일 어려웠던 부분은 PDF 파일의 quality를 유지하는 것이었습니다. 처음에는 PDF의 페이지들을 이미지화하여 browser의 Canvas API를 이용해서 편집을 한 후 이미지를 PDF로 변환하는 방식을 택했지만 편집이 추가될수록 quality가 너무 많이 저하되는 현상이 있었습니다. 이를 해결하기 위해 가상 canvas를 사용하였습니다. 원본 PDF의 이미지는 그대로 두고 편집 모드로 들어가서 똑같은 비율의 또 다른 canvas를 overlap 시켜 그 편집용 canvas에서 서명을 하는 방식으로 변경하였습니다.
- 상기 방식으로 PDF 파일의 quality는 보장할 수 있었습니다. 다만, 가상 캔버스에서 서명하는 위치와 원본 PDF의 이미지의 위치에 미세한 차이가 있어 조금은 미비한 상태로 마무리를 지은 것 같습니다. event의 client, offset 위치를 사용하여 좌표를 공유하는 방식으로 구현을 했지만 작은 버그들이 발생하여 화면 좌표에 대한 더 깊은 공부 후 다시 시도해 볼 예정입니다.

### PDF 파일에 Digital ID 서명 삽입 시도

- PDF의 [디지털 서명에 대한 공식 문서](https://www.adobe.com/devnet-docs/etk_deprecated/tools/DigSig/Acrobat_DigitalSignatures_in_PDF.pdf)를 보면 PDF 서명도 Public Key Infrastructure의 도입을 통해 서명 시 digital ID를 생성하여 문서의 변조를 방지하고 서명의 진위여부를 판단할 수 있도록 만들어져 있습니다. Digital ID란 public/private key 와 GlobalSign 이나 Entrust와 같은 제 3자 인증기관에서 인증 받을 수 있는 certificate file 로 이루어진 것을 뜻합니다.
- 일반적으로 서명 기능이 부여된 PDF는 Hexadecimal editor를 통해 열어보면 ByteRange 라는 4개의 숫자로 이루어진 PDF hex code 가 PDF에서의 서명 위치와 digital id가 들어간 서명값을 가지고 있고 이번 프로젝트의 목표로 이렇게 서명 값을 PDF삽입 해주는것 까지 목표로 잡았었습니다.
- 제 3자 Certificate Authority 를 사용하지 않고 node js 의 child process execute를 통해 openSSL api를 이용한 self-signed certificate을 발행하려고 시도해 보았으나 child process 작동 방식에 대한 이해도가 부족하여 실패했습니다. certificate 관련 라이브러리를 찾아서 public/private key 와 self signed certificate을 발행하는것 까지 성공하고 pdf-lib라이브러리로 PDF파일을 byte단위로 읽어서 서명을 삽입 하는 단계까지 이르렀지만 이 단계에서 라이브러리 에러 문제로 다시한번 실패 했습니다. 저에게 좀 과분한 내용의 기능 구현 시도였지만 많은것을 공부 할 수 있었고 시간이 된다면 이 기능을 꼭 성공해보고 싶습니다.
