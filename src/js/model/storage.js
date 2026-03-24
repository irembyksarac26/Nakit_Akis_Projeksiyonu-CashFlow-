/**
 * localStorage işlemleri
 */

const PREFIX = "nakit_akisi_senaryo_";

export const saveScenario = (name, config) => {
    const data = { name, config };
    localStorage.setItem(PREFIX + name, JSON.stringify(data));
    localStorage.setItem("nakit_akisi_last_scenario", name);
};

export const deleteScenario = (name) => {
    localStorage.removeItem(PREFIX + name);
    const list = getScenarioList();
    if (list.length > 0) {
        localStorage.setItem("nakit_akisi_last_scenario", list[0]);
    } else {
        localStorage.removeItem("nakit_akisi_last_scenario");
    }
};

export const getScenario = (name) => {
    const data = localStorage.getItem(PREFIX + name);
    return data ? JSON.parse(data) : null;
};

export const getScenarioList = () => {
    const list = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(PREFIX)) {
            list.push(key.replace(PREFIX, ""));
        }
    }
    return list;
};

export const getLastScenarioName = () => {
    return localStorage.getItem("nakit_akisi_last_scenario");
};
