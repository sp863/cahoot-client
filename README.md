# Cahoot Client
- [배포 URL](https://cahoot.netlify.app/)

## Installation

```sh
npm install
npm start
// environment variables not included
```

## Motivation
이전 회사를 다니면서 업무 담당자에게 계약서 서명 과정을 전통적인 방식으로 업무 진행을 했었는데 이 때 디지털 서명이란것이 활성화 되어있었다면 얼마나 편리했을까라는 생각에서 비롯되어 프로젝트를 구성하게 되었습니다. 또한 요즘 IT업계에서도 외국 개발자들과의 협업을 늘려나가고 있는 추세로 알고 있습니다. 이런 트렌드에 맞춰 외국 개발자 및 업체들과 계약을 체결하고 프로젝트 협업을 할 수 있는 서비스를 만들고자 노력했습니다.

디지털 서명 기능은 대한민국 민법, 전자서명법 3조, 전자 문서 및 전자거래 기본법 4조에 최대한 부합될수 있도록 구현을 시도해보았습니다. 중요 포인트는 2가지입니다.

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


## Duration

- Week 1 (2022.06.27 - 07.03)
  - 아이디어 구상
  - 기획 및 Mock up
  - 기술 Proof of Concept
  - 배경 조사
- Week 2-3 (2022.07.04 - 07.17)
  - 기능 구현
  - 리드미 초안
  - 배포

## Challenges

### PDF 문서를 이미지화 편집하는 기능

- 보통 PDF파일이나 문서는 Acrobat Reader 라는 익숙한 프로그램으로 다양한 편집을 할 수 있습니다. 이런 프로그램은 PDF의 텍스트 편집 및 전자 서명을 할 수 있는 다양한 기능을 제공하는데 실제 제 경험상 현업에서는 자사의 법무팀에서 만든 계약서 양식이 따로 존재하고 PDF 형식에 맞추어 만드는 경우는 드물었었습니다. 때문에 이번 프로젝트에서는 다양한 문서 양식을 사용할 수 있으면서 서명을 그 문서 위치에 맞게 편집이 가능하도록 구현 시도를 했었습니다.
- 이런 PDF 편집 기능을 구현하면서 제일 어려웠던 부분은 PDF 파일의 quality 를 유지하는 것이었습니다. 처음에는 PDF의 페이지들을 이미지화 하여 browser의 Canvas API를 이용해서 편집을 한 후 이미지를 PDF로 변환 하는 방식을 택했지만 편집이 추가될 수록 quality가 너무 많이 저하 되는 현상이 있었습니다. 때문에 가상 canvas를 사용하는 방식으로 원본 PDF의 이미지는 그대로 두고 편집 모드로 들어가면 똑같은 비율의 또하나의 canvas를 overlap 시켜 그 편집용 canvas에서 서명을 하는 방식으로 변경했습니다.
- 위 방식의 변경으로 quality 는 보장 할 수 있었지만 문제는 가상 캔버스에서 서명하는 위치와 원본 PDF의 이미지의 위치를 일치시켜야되는것인데 이 부분에서 많은 시행 착오가 있었고 일정이 과도하게 지연 될 수 있어 아직까지도 조금 미비한 상태로 마무리를 지은것 같습니다. event 의 client, offset 위치를 사용하여 좌표를 공유하는 방식으로 구현을 했지만 작은 버그들이 발생이 되어 화면 좌표에 대한 더 깊은 공부 후 다시 시도해 볼 예정입니다.

### PDF 파일에 Digital ID 서명 삽입 시도

- PDF의 [디지털 서명에 대한 공식 문서](https://www.adobe.com/devnet-docs/etk_deprecated/tools/DigSig/Acrobat_DigitalSignatures_in_PDF.pdf)를 보면 PDF 서명도 Public Key Infrastructure의 도입을 통해 서명 시 digital ID를 생성하여 문서의 변조를 방지하고 서명의 진위여부를 판단할 수 있도록 만들어져 있습니다. Digital ID란 public/private key 와 GlobalSign 이나 Entrust와 같은 제 3자 인증기관에서 인증 받을 수 있는 certificate file 로 이루어진 것을 뜻합니다.
- 일반적으로 서명 기능이 부여된 PDF는 Hexadecimal editor를 통해 열어보면 ByteRange 라는 4개의 숫자로 이루어진 PDF hex code 가 PDF에서의 서명 위치와 digital id가 들어간 서명값을 가지고 있고 이번 프로젝트의 목표로 이렇게 서명 값을 PDF삽입 해주는것 까지 목표로 잡았었습니다.
- 제 3자 Certificate Authority 를 사용하지 않고 node js 의 child process execute를 통해 openSSL api를 이용한 self-signed certificate을 발행하려고 시도해 보았으나 child process 작동 방식에 대한 이해도가 부족하여 실패했습니다. certificate 관련 라이브러리를 찾아서 public/private key 와 self signed certificate을 발행하는것 까지 성공하고 pdf-lib라이브러리로 PDF파일을 byte단위로 읽어서 서명을 삽입 하는 단계까지 이르렀지만 이 단계에서 라이브러리 에러 문제로 다시한번 실패 했습니다. 저에게 좀 과분한 내용의 기능 구현 시도였지만 많은것을 공부 할 수 있었고 시간이 된다면 이 기능을 꼭 성공해보고 싶습니다.

## 프로젝트를 마치며

### 문제 해결 능력과 공부의 깊이

이번 프로젝트를 마치면서 다시한번 느꼈던 것은 문제해결 능력의 중요성입니다. 4개월 간의 부트캠프 기간과 마지막 프로젝트를 겪으면서 짧은 기간이었지만 수 많은 문제들을 어떻게 해결해야되는지에 대해서 배울 수 있었던 시간이었던 것 같습니다. 특히 바닐라 코딩 같이 자기주도적 학습이 최우선으로 강조되는 환경에서 더 뼈저리게 느꼈고 예비 개발자로서 이 부분에서 조금이나마 성장을 하지 않았나라고 생각합니다.

프로젝트를 마치고 제일 남는 기억들은 문제해결을 하기 위해서 읽어본 수 많은 공식 문서들, stack overflow 자료들, 블로그들, 예시들, 유투브 선생님들이지 않나 싶습니다. 이번 프로젝트에서 어떻게 하면 실제 서명과 같은 기능을 구현 할 수 있을까 고민하다보니 더 깊은 공부를 하게 되었고 프로젝트 결과에 대해서는 아쉬움이 남지만 디지털 서명이라는 기능을 구현하려고 투자한 노력과 시간들은 너무나 값진 자산이 되었다고 생각합니다. 평소 자세히 공부하지 못했던 browser가 제공해주는 interface 들 그리고 백엔드에서 문서 보안을 위해 공부 하고 시도 했었던 public key infrastructure, child process 등 더 깊은 공부를 할 수 있는 계기가 되었습니다.

이번 계기를 통해 더 발전하는 개발자 즉 문제해결을 더 잘하는 개발자가 되려면 2가지의 요소가 중요하다고 느꼈습니다. 좌절하지 않는 마음과 공부의 깊이 입니다. 문제 해결을 위해 공부를 하고 이런 저런 시도를 하다보면 너무나 큰 벽을 마주칠 때가 많았던 것 같습니다. 때로는 그런 벽을 뚫을 수도 있었고 우회해서 지나갈 수도 있었지만 못뚫었을때의 좌절감이 개발자로서 엄청난 악영향이라는 것을 깨달았습니다. 이런 순간들을 대비해 더 깊은 공부를 해야겠다고 느꼈고 또 나 자신의 한계를 느꼈다 하더라도 끊임없이 도전해 보는 attitude를 가져야 한다고 생각합니다.
