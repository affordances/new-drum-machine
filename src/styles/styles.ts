import styled from "styled-components";

export const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 32px auto;
  width: 816px;
`;

export const Title = styled.div`
  font-size: 24px;
  letter-spacing: 8px;
  margin-bottom: 4px;
`;

export const Subtitle = styled.div`
  font-size: 18px;
  font-weight: 200;
  letter-spacing: 2px;
  margin-bottom: 24px;
`;

export const InnerContainer = styled.div`
  display: flex;
`;

export const InstrumentNames = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: -48px;
`;

export const Staff = styled.div`
  display: flex;
  margin-bottom: 16px;
  width: 768px;
`;

export const Name = styled.div`
  align-items: center;
  display: flex;
  height: 48px;
  width: 48px;
  justify-content: center;
`;

export const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 768px;
`;

export const ControlsRow = styled.div`
  align-items: center;
  display: flex;
  height: 48px;
  justify-content: space-between;
  width: 100%;
`;

export const Tempo = styled.div`
  align-items: center;
  display: flex;
  font-size: 20px;
  height: 48px;
  justify-content: center;
  width: 96px;
`;

export const TempoSlider = styled.input`
  -webkit-appearance: none;
  outline-style: none;
  padding: 0 16px;
  width: 100%;

  &::-webkit-slider-runnable-track {
    background: black;
    cursor: pointer;
    height: 2px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: white;
    border-radius: 100px;
    border: 2px solid black;
    cursor: pointer;
    height: 16px;
    margin-top: -6px;
    width: 16px;
  }
`;

export const StyledButton = styled.button`
  border: 2px solid black;
  background-color: white;
  cursor: pointer;
  font-family: inherit;
  font-size: 18px;
  height: 48px;
  outline-style: none;
  width: 192px;

  &:hover {
    background-color: whitesmoke;
  }
`;

export const StyledSelect = styled.select`
  border: 2px solid black;
  background-color: white;
  cursor: pointer;
  font-family: inherit;
  font-size: 18px;
  height: 48px;
  outline-style: none;
  text-align: center;
  width: 192px;

  -webkit-appearance: none;
  -moz-appearance: none;

  // for safari
  text-align-last: center;
`;

export const Directions = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

export const Text = styled.div`
  font-size: 12px;
`;
