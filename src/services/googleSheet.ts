import Papa from 'papaparse';
import type { Player } from '../types';

export const fetchPlayersFromSheet = async (sheetUrl: string): Promise<Player[]> => {
  try {
    let csvUrl = sheetUrl;

    if (sheetUrl.includes('output=csv') || sheetUrl.includes('format=csv')) {
      csvUrl = sheetUrl;
    } else if (sheetUrl.includes('/edit')) {
      const match = sheetUrl.match(/\/d\/(.*?)(\/|$)/);
      if (match) {
        csvUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
      }
    } else if (sheetUrl.includes('/pubhtml')) {
        csvUrl = sheetUrl.replace('/pubhtml', '/pub?output=csv');
    }

    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error(`Failed: ${response.statusText}`);
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const players: Player[] = results.data.map((row: any, index) => {
            // 1. 닉네임 (Name or 닉네임)
            const name = row['닉네임'] || row['Name'] || row['name'] || 'Unknown';
            
            // 2. 롤 계정 (롤 계정 or IngameName or Name)
            // * 팁: 시트의 '롤 계정' 헤더를 정확히 찾습니다.
            const ingameName = row['롤 계정'] || row['롤계정'] || row['IngameName'] || row['Ign'] || name;
            
            // 3. 포지션 (포지션 or Position)
            // * 팁: 시트에서 "SUP ADC" 처럼 공백으로 된 것도 그대로 가져옵니다.
            let positionRaw = row['포지션'] || row['Position'] || row['position'] || 'MID';
            const position = positionRaw.toUpperCase();

            // 4. 티어 (티어 or Tier)
            const tier = row['티어'] || row['Tier'] || row['tier'] || 'Unranked';
            //5. 주챔
            const mostChampions = row['주챔'] || row['mostChampions'] || row['MostChampions'] || '';

            return {
              id: `p-${index}`,
              name: name,
              ingameName: ingameName,
              position: position,
              tier: tier,
              mostChampions: mostChampions
            };
          });
          resolve(players);
        },
        error: (err: any) => reject(err),
      });
    });
  } catch (error) {
    console.error("Failed to fetch sheet", error);
    alert("시트를 불러오는데 실패했습니다. 링크 권한이 '웹에 게시' 상태인지 확인해주세요.");
    return [];
  }
};