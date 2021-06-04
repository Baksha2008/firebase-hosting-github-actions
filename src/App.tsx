import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 20px;
  max-height: 100vh;
`;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  border: 1px solid black;
  border-radius: 8px;
  cursor: pointer;
`;

const Box = styled.div`
  width: 25%;
  text-align: center;
  border: 1px solid black;
`;

const HeaderBox = styled.div`
  width: 25%;
  text-align: center;
  margin: 0 0 10px 0;
`;

const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 0;
  left: 0;
`;

const ModalInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40vw;
  height: 40vh;
  background: #fff;
  border-radius: 8px;
  border: 1px solid black;
`;

const CloseButton = styled.p`
  color: red;
  cursor: pointer;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: scroll;
`;

function App() {
  const [state, setState] = useState({
    isLoad: true,
    data: [] as any,
    selectedData: {} as any,
    input: "",
    isModalOpen: false,
    sort: "alfa",
  });

  useEffect(() => {
    onFetchData();
  }, []);

  const onToggleModal = () => {
    setState((s) => ({
      ...s,
      isModalOpen: !s.isModalOpen,
    }));
  };

  const onFetchData = async () => {
    try {
      const total = await axios.get("https://api.covid19api.com/summary");

      setState((s) => ({
        ...s,
        data: total.data.Countries,
        isLoad: false,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const onSelectCountry = (selectedData: any) => {
    setState((s) => ({
      ...s,
      selectedData,
    }));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setState((s) => ({
      ...s,
      input: value,
    }));
  };

  const onSelectedFilter = (e: any) => {
    setState((s) => ({
      ...s,
      sort: e.target.id,
    }));
  };

  const filteredArr = state.data
    .sort((a: any, b: any) => {
      if (a[state.sort] > b[state.sort]) {
        return 1;
      }
      if (a[state.sort] < b[state.sort]) {
        return -1;
      }
      return 0;
    })
    .filter((el: any) =>
      el.Country.toLowerCase().includes(state.input.toLowerCase())
    );

  if (state.isLoad) {
    return <p>loading...</p>;
  }

  return (
    <div className="App">
      <Wrapper>
        <ItemWrapper>
          <HeaderBox id="Country" onClick={onSelectedFilter}>
            Country
          </HeaderBox>
          <HeaderBox id="TotalConfirmed" onClick={onSelectedFilter}>
            Confirmed
          </HeaderBox>
          <HeaderBox id="TotalDeaths" onClick={onSelectedFilter}>
            Deaths
          </HeaderBox>
          <HeaderBox id="TotalRecovered" onClick={onSelectedFilter}>
            Recovered
          </HeaderBox>
        </ItemWrapper>
        <input
          onChange={onChange}
          value={state.input}
          placeholder="search..."
        />
        <ListWrapper>
          {filteredArr.map((el: any) => {
            const onClick = () => {
              onSelectCountry(el);
              onToggleModal();
            };

            return (
              <ItemWrapper onClick={onClick} key={el.ID}>
                <ItemWrapper>
                  <Box>{el.Country}</Box>
                  <Box>{el.TotalConfirmed}</Box>
                  <Box>{el.TotalDeaths}</Box>
                  <Box>{el.TotalRecovered}</Box>
                </ItemWrapper>
              </ItemWrapper>
            );
          })}
        </ListWrapper>
        {state.isModalOpen && (
          <ModalWrapper>
            <ModalInfoBox>
              <p>Country - {state.selectedData.Country}</p>
              <p>Confirmed - {state.selectedData.TotalConfirmed}</p>
              <p>Death - {state.selectedData.TotalDeaths}</p>
              <p>Recovered - {state.selectedData.TotalRecovered}</p>
              <CloseButton onClick={onToggleModal}>close</CloseButton>
            </ModalInfoBox>
          </ModalWrapper>
        )}
      </Wrapper>
    </div>
  );
}

export default App;
