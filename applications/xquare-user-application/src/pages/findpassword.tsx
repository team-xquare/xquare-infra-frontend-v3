import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Button_square,
  ErrorMessage,
  Logo,
  Typography,
  Xquare_colors,
} from "@xquare/user-interfaces";
import { FindPasswordFields } from "./findpassword/FindPasswordFields";
import {
  LAST_STEP,
  useFindPasswordForm,
} from "./findpassword/useFindPasswordForm";
import {
  Container,
  FormActions,
  FormCard,
  Inputs,
  Left,
  LinkRow,
  LogoImg,
  Right,
} from "./findpassword/styles";

const Findpassword = () => {
  const form = useFindPasswordForm();

  return (
    <Container>
      <Helmet>
        <title>XQUARE | Find Password</title>
      </Helmet>
      <Left>
        <LogoImg src={Logo} alt="Xquare logo" />
      </Left>
      <Right aria-label="비밀번호 찾기 영역">
        <FormCard onSubmit={form.handleSubmit}>
          <Typography size="10x" weight="extraBold" align="center">
            FIND PASSWORD
          </Typography>
          {form.errorMsg && <ErrorMessage message={form.errorMsg} />}
          <Inputs className={form.isFading ? "fade-out" : "fade-in"}>
            <FindPasswordFields form={form} />
          </Inputs>
          <FormActions>
            {form.step === 1 && (
              <Button_square type="submit" disabled={!form.isStepValid}>
                다음으로
              </Button_square>
            )}
            {form.step === 2 && (
              <Button_square
                type="button"
                onClick={
                  form.showVerifyInput
                    ? form.handleEmailVerifySubmit
                    : form.handleEmailVerifySend
                }
                disabled={
                  !form.isStepValid ||
                  form.emailVerifyLoading ||
                  form.emailVerifySubmitLoading
                }
              >
                {form.showVerifyInput
                  ? form.emailVerifySubmitLoading
                    ? "검증 중..."
                    : "인증코드 검증"
                  : form.emailVerifyLoading
                    ? "발송 중..."
                    : "인증코드 발송"}
              </Button_square>
            )}
            {form.step === LAST_STEP && (
              <Button_square
                type="submit"
                disabled={!form.isStepValid || form.resetLoading}
              >
                {form.resetLoading ? "변경 중..." : "완료하기"}
              </Button_square>
            )}
            {form.step > 1 && form.step < LAST_STEP && (
              <LinkRow>
                <Typography size="2x" weight="regular">
                  잘못 입력하셨나요?
                </Typography>
                <Typography
                  size="2x"
                  weight="regular"
                  color={String(Xquare_colors.blue[500])}
                  onClick={form.handleBackToIdentity}
                  style={{ cursor: "pointer" }}
                >
                  뒤로가기
                </Typography>
              </LinkRow>
            )}
            {form.step === 1 && (
              <LinkRow>
                <Typography size="2x" weight="regular">
                  비밀번호가 기억나시나요?
                </Typography>
                <Link
                  to="/login"
                  style={{ textDecoration: "none", height: "1.8rem" }}
                >
                  <Typography
                    size="2x"
                    weight="regular"
                    color={String(Xquare_colors.blue[500])}
                  >
                    로그인하기
                  </Typography>
                </Link>
              </LinkRow>
            )}
          </FormActions>
        </FormCard>
      </Right>
    </Container>
  );
};

export default Findpassword;
