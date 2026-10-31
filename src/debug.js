
function 装備DISCの出現率を検証(part) {
    const 回数 = 1000;
    const 統計 = {};

    for (let i = 0; i < 回数; i++) {
        const disc = 装備DISCをランダムに取得(part);
        統計[disc.name] = (統計[disc.name] || 0) + 1;
    }

    console.table(
        Object.entries(統計).map(([名前, 出現回数]) => ({
            名前,
            出現回数,
            出現率: `${(出現回数 / 回数 * 100).toFixed(1)}%`,
        }))
    );
}

function 射撃DISCの出現率を検証(part) {
    const 回数 = 100;
    const 統計 = {};

    for (let i = 0; i < 回数; i++) {
        const disc = 射撃DISCをランダムに取得(part);
        統計[disc.name] = (統計[disc.name] || 0) + 1;
    }

    console.table(
        Object.entries(統計).map(([名前, 出現回数]) => ({
            名前,
            出現回数,
            出現率: `${(出現回数 / 回数 * 100).toFixed(1)}%`,
        }))
    );
}

function setVar478() {
    return new Proxy(var_478, {
        set(target, property, value) {
            const total = target.reduce((sum, value) => sum + value, 0);
            const newTotal = total - (target[property] || 0) + value;
            if (newTotal > 1) {
                // debugger;
            }
            return Reflect.set(target, property, value);
        }
    });
}
