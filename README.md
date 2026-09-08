# mc해머의 모험 — GitHub Pages 배포

이 폴더를 전용 GitHub 저장소의 루트로 사용하세요. `site`에는 검수된 웹 게임과 22곡 영상이 들어 있습니다. `.github/workflows/pages.yml`은 수동 배포 설정입니다.

## 처음 게시하기

1. GitHub에 새 저장소를 만드세요. GitHub Free를 쓰면 Public 저장소가 필요합니다.
2. GitHub Desktop으로 저장소를 Clone하고, 이 폴더 안의 `.github`, `site`, `README.md`, `PACKAGE.json`을 복사하세요. 바깥의 `mc-hammer-github-pages` 폴더 자체를 한 겹 더 넣지 마세요.
3. GitHub Desktop에서 Commit 후 Push하세요. 게임 파일이 웹 업로드의 파일당 25MiB 제한을 넘으므로 GitHub 웹 화면으로 드래그해서 업로드하지 마세요. 이 ZIP 자체를 저장소에 올리지 마세요.
4. 저장소의 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 선택하세요.
5. **Actions → Deploy game to GitHub Pages → Run workflow**에서 기본 브랜치를 선택하고 실행하세요.
6. 완료된 작업의 `github-pages` 링크를 여세요. 일반적인 주소는 `https://계정명.github.io/저장소명/`입니다.

다음 업데이트는 `site` 파일을 교체한 뒤 Commit/Push하고 같은 배포 작업을 실행하세요. 업로드만으로 자동 게시하지 않습니다. Pages 설정이나 조직 정책에서 작업 실행 승인을 요구하면 GitHub 화면의 안내를 따르세요.

## 확인 사항

- 약 219MB의 정적 웹 버전입니다. GitHub Pages 사이트 한도 1GB, 일반 Git 파일 한도 100MiB 안에 들어갑니다.
- 경로가 상대 경로여서 `/저장소명/` 주소에서 사용할 수 있습니다. Godot 스레드 지원은 꺼져 있으며 별도 COOP/COEP 헤더 설정은 필요하지 않습니다.
- 처음에는 게임 엔진과 데이터 약 69MB를 내려받습니다. 곡 영상은 선택할 때 불러옵니다. GitHub Pages에는 월 100GB의 소프트 대역폭 제한이 있으므로 영상 재생이 많은 서비스로 성장하면 호스팅 재검토가 필요합니다.
- 휴대폰에서는 화면을 터치하고, PC에서는 곡을 클릭하면 브라우저의 오디오 재생 제한을 해제할 수 있습니다.
- 이 패키지는 로컬에서 파일 구성과 원본 일치를 확인했습니다. 실제 GitHub Pages 게시와 게시 주소에서의 실행 검사는 아직 하지 않았습니다.
- Windows EXE와 전체 개발 폴더는 이 웹 저장소에 넣지 마세요. 실행에 필요한 웹 파일과 라이선스 고지는 이미 포함되어 있습니다.

공식 안내: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
용량 제한: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
파일 업로드 제한: https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github