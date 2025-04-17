"use client"; // 클라이언트 컴포넌트 사용 선언

import React, { useEffect, useState } from "react";

export default function UpbitPricesPage() {
  const [btcPrice, setBtcPrice] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);

  // Upbit API 주소
  const API_URL = "https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-ETH";

  // 시세 불러오기 함수
  const fetchPrices = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Upbit API 응답에 문제가 있습니다.");
      }
      const data = await response.json();
      /**
       * data 예시:
       * [
       *   { market: 'KRW-BTC', trade_price: 37000000, ... },
       *   { market: 'KRW-ETH', trade_price: 2400000, ... }
       * ]
       */
      const btcData = data.find((item) => item.market === "KRW-BTC");
      const ethData = data.find((item) => item.market === "KRW-ETH");

      if (btcData) setBtcPrice(btcData.trade_price);
      if (ethData) setEthPrice(ethData.trade_price);
    }
catch (error) {
      console.error("시세 조회 오류:", error);
    }
  };
// 마운트 시점에 1초마다 fetchPrices 실행
  useEffect(() => {
    // 초기 1회
    fetchPrices();

    // 1초 주기로 재실행
    const intervalId = setInterval(fetchPrices, 1000);

    // 언마운트될 때 인터벌 해제
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Upbit 시세 조회 (Next.js, JSX)</h1>
      <div style={styles.priceBox}>
        <h2>비트코인 (BTC/KRW)</h2>
        <p>
          {btcPrice !== null
            ? `${btcPrice.toLocaleString()} 원`
            : "불러오는 중..."}
        </p>
      </div>
      <div style={styles.priceBox}>
        <h2>이더리움 (ETH/KRW)</h2>
        <p>
          {ethPrice !== null
            ? `${ethPrice.toLocaleString()} 원`
            : "불러오는 중..."}
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "2rem",
    textAlign: "center",
  },
  title: {
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
  },
  priceBox: {
    marginBottom: "1rem",
    padding: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
};