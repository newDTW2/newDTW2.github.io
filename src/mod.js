
function アイテム種別をランダムに取得(出現確率) {
    const 候補一覧 = Object.values(出現確率);
    const 重み合計 = 候補一覧.reduce((合計, 候補) => 合計 + 候補.weight, 0);
    let 乱数 = Math.random() * 重み合計;

    for (const 候補 of 候補一覧) {
        乱数 -= 候補.weight;
        if (乱数 < 0) {
            return 候補.type;
        }
    }
}

function 装備DISCをランダムに取得(part) {
    const 部の対象一覧 = 装備DISC一覧.filter(disc =>
        disc.part.includes(part) &&
        disc.rarity !== "X"
    );

    const 出現率 = {
        R: 1 / 25,
        SR: 1 / 50,
        SSR: 1 / 100,
        UR: 1 / 150,
    };

    const レア一覧 = 部の対象一覧.filter(
        disc => 出現率[disc.rarity] !== undefined
    );

    const N一覧 = 部の対象一覧.filter(
        disc => disc.rarity === "N"
    );

    const レア合計確率 = レア一覧.reduce(
        (sum, disc) => sum + 出現率[disc.rarity],
        0
    );

    if (レア合計確率 > 1) {
        throw new Error("レアDISCの出現確率の合計が100%を超えている！");
    }

    if (N一覧.length === 0 && レア合計確率 < 1) {
        throw new Error("生成できるアイテムがない！");
    }

    let 抽選値 = Math.random();
    let 累積確率 = 0;

    for (const disc of レア一覧) {
        累積確率 += 出現率[disc.rarity];

        if (抽選値 < 累積確率) {
            return disc;
        }
    }

    if (N一覧.length === 0) {
        return レア一覧[rnd(レア一覧.length)];
    }

    return N一覧[rnd(N一覧.length)];
}

function 射撃DISCをランダムに取得(part) {
    const 対象一覧 = 射撃DISC一覧.filter(
        disc => disc.part.includes(part) && disc.weight > 0
    );

    const 重み合計 = 対象一覧.reduce(
        (sum, disc) => sum + disc.weight,
        0
    );

    if (重み合計 === 0) {
        throw new Error("生成できる射撃DISCがない！");
    }

    let 抽選値 = rnd(重み合計);

    for (const disc of 対象一覧) {
        抽選値 -= disc.weight;

        if (抽選値 < 0) {
            return disc;
        }
    }
}


