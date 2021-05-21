export const Levels = {
    Easy: {
        name: "Easy",
        mines: 10,
        width:9,
        height: 9
    },
    Medium: {
        name: "Medium",
        mines: 40,
        width: 16,
        height: 16
    },
    Expert: {
        name: "Expert",
        mines: 99,
        width: 30,
        height: 16
    }
};

export const GameState = {
    NewGame: 0,
    Ongoing: 1,
    Loss: 2,
    Win: 3
};

export const MaxTime = 999;
