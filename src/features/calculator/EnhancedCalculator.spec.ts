import { expect, describe, it } from "vitest";
import { CalculatorCore } from "../../core/calculator/CalculatorCore";
import { CalculatorStatus } from "../../core/calculator/domain/CalculatorState";

describe("계산기 도메인 모델 테스트", () => {
  it("두 숫자의 덧셈을 수행할 수 있다", () => {
    const calculator = new CalculatorCore();

    // "1 + 2";
    calculator.apply({ type: "DIGIT_INPUT", digit: "1" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "+" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "2" });
    calculator.apply({ type: "CALCULATE" });

    expect(calculator.getState().result).toBe("3");
  });

  it("두 자리 숫자의 덧셈을 수행할 수 있다", () => {
    const calculator = new CalculatorCore();

    // "12 + 34";
    calculator.apply({ type: "DIGIT_INPUT", digit: "1" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "2" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "+" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "3" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "4" });
    calculator.apply({ type: "CALCULATE" });

    expect(calculator.getState().result).toBe("46");
  });

  it("두 숫자의 뺄셈을 수행할 수 있다", () => {
    const calculator = new CalculatorCore();

    // "5 - 3";
    calculator.apply({ type: "DIGIT_INPUT", digit: "5" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "-" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "3" });
    calculator.apply({ type: "CALCULATE" });

    expect(calculator.getState().result).toBe("2");
  });

  it("두 숫자의 곱셈을 수행할 수 있다", () => {
    const calculator = new CalculatorCore();

    // "4 * 5";
    calculator.apply({ type: "DIGIT_INPUT", digit: "4" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "*" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "5" });
    calculator.apply({ type: "CALCULATE" });

    expect(calculator.getState().result).toBe("20");
  });

  it("두 숫자의 나눗셈을 수행할 수 있다", () => {
    const calculator = new CalculatorCore();

    // "8 / 4";
    calculator.apply({ type: "DIGIT_INPUT", digit: "8" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "/" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "4" });
    calculator.apply({ type: "CALCULATE" });

    expect(calculator.getState().result).toBe("2");
  });

  it("연산자 우선순위를 올바르게 처리할 수 있다", () => {
    const calculator = new CalculatorCore();

    // "1 + 2 * 3";
    calculator.apply({ type: "DIGIT_INPUT", digit: "1" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "+" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "2" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "*" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "3" });
    calculator.apply({ type: "CALCULATE" });

    // 곱셈이 먼저 수행되어야 함 (2*3) + 1 = 7
    expect(calculator.getState().result).toBe("7");
  });

  it("괄호를 사용하여 우선순위를 변경할 수 있다", () => {
    const calculator = new CalculatorCore();

    // "(1 + 2) * 3";
    calculator.apply({ type: "PARENTHESIS_INPUT", parenthesis: "(" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "1" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "+" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "2" });
    calculator.apply({ type: "PARENTHESIS_INPUT", parenthesis: ")" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "*" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "3" });
    calculator.apply({ type: "CALCULATE" });

    expect(calculator.getState().result).toBe("9");
  });

  it("중첩된 괄호를 올바르게 처리할 수 있다", () => {
    const calculator = new CalculatorCore();

    // "( 1 + ( 2 * 3 ) )";
    calculator.apply({ type: "PARENTHESIS_INPUT", parenthesis: "(" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "1" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "+" });
    calculator.apply({ type: "PARENTHESIS_INPUT", parenthesis: "(" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "2" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "*" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "3" });
    calculator.apply({ type: "PARENTHESIS_INPUT", parenthesis: ")" });
    calculator.apply({ type: "PARENTHESIS_INPUT", parenthesis: ")" });
    calculator.apply({ type: "CALCULATE" });

    expect(calculator.getState().result).toBe("7");
  });

  it("0으로 나누기를 시도할 경우 오류를 발생시킨다", () => {
    const calculator = new CalculatorCore();

    // "5 / 0";
    calculator.apply({ type: "DIGIT_INPUT", digit: "5" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "/" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "0" });
    calculator.apply({ type: "CALCULATE" });

    const state = calculator.getState();
    expect(state.status).toBe(CalculatorStatus.ERROR);
    expect(state.errorMessage).toContain("0으로 나눌 수 없습니다");
  });

  it("숫자 뒤에 괄호를 입력하면 곱셈으로 간주한다", () => {
    const calculator = new CalculatorCore();

    // "2(3+4)";
    calculator.apply({ type: "DIGIT_INPUT", digit: "2" });
    calculator.apply({ type: "PARENTHESIS_INPUT", parenthesis: "(" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "3" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "+" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "4" });
    calculator.apply({ type: "PARENTHESIS_INPUT", parenthesis: ")" });
    calculator.apply({ type: "CALCULATE" });

    // 내부에서 곱셈으로 처리: 2*(3+4) = 14
    expect(calculator.getState().result).toBe("14");
  });

  it("숫자 뒤에 괄호를 입력하고 곧바로 엔터를 누르면 연산이 된다", () => {
    const calculator = new CalculatorCore();

    // "123(123)";
    calculator.apply({ type: "DIGIT_INPUT", digit: "1" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "2" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "3" });
    calculator.apply({ type: "PARENTHESIS_INPUT", parenthesis: "(" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "1" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "2" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "3" });
    calculator.apply({ type: "PARENTHESIS_INPUT", parenthesis: ")" });
    calculator.apply({ type: "CALCULATE" });

    expect(calculator.getState().result).toBe((123 * 123).toString());
  });

  it("음수에 대한 덧셈을 수행할 수 있다", () => {
    const calculator = new CalculatorCore();

    // "-123 + 1";
    calculator.apply({ type: "OPERATOR_INPUT", operator: "-" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "1" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "2" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "3" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "+" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "1" });
    calculator.apply({ type: "CALCULATE" });

    expect(calculator.getState().result).toBe("-122");
  });

  it("음수에 대한 뺄셈을 수행할 수 있다", () => {
    const calculator = new CalculatorCore();

    // "-123 - 1";
    calculator.apply({ type: "OPERATOR_INPUT", operator: "-" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "1" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "2" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "3" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "-" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "1" });
    calculator.apply({ type: "CALCULATE" });

    expect(calculator.getState().result).toBe("-124");
  });

  it("음수에 대한 곱셈을 수행할 수 있다", () => {
    const calculator = new CalculatorCore();

    // "-123 * 2";
    calculator.apply({ type: "OPERATOR_INPUT", operator: "-" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "1" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "2" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "3" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "*" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "2" });
    calculator.apply({ type: "CALCULATE" });

    expect(calculator.getState().result).toBe("-246");
  });

  it("음수에 대한 나눗셈을 수행할 수 있다", () => {
    const calculator = new CalculatorCore();

    // "-123 / 3";
    calculator.apply({ type: "OPERATOR_INPUT", operator: "-" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "1" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "2" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "3" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "/" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "3" });
    calculator.apply({ type: "CALCULATE" });

    expect(calculator.getState().result).toBe("-41");
  });

  it("연속된 계산을 수행할 수 있다", () => {
    const calculator = new CalculatorCore();

    // "1 + 2";
    calculator.apply({ type: "DIGIT_INPUT", digit: "1" });
    calculator.apply({ type: "OPERATOR_INPUT", operator: "+" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "2" });
    calculator.apply({ type: "CALCULATE" });

    // 결과: 3
    expect(calculator.getState().result).toBe("3");

    // 이어서 "* 4";
    calculator.apply({ type: "OPERATOR_INPUT", operator: "*" });
    calculator.apply({ type: "DIGIT_INPUT", digit: "4" });
    calculator.apply({ type: "CALCULATE" });

    // 결과: 12
    expect(calculator.getState().result).toBe("12");
  });
});
