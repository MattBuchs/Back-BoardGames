export const initializeSquares = () => {
    let dialingId = 0;
    return Array(100)
        .fill(null)
        .map((_, index) => {
            const row = Math.floor(index / 10);
            const col = index % 10;
            const isBlackSquare = (row + col) % 2 !== 0;
            const color = isBlackSquare ? "bg-[#86421d]" : "bg-[#d2a973]";

            if (isBlackSquare) {
                dialingId++;
                if (row < 4)
                    return {
                        id: index,
                        img: "/b-pawn.png",
                        color,
                        selected: false,
                        dialingId,
                    };
                else if (row > 5)
                    return {
                        id: index,
                        img: "/w-pawn.png",
                        color,
                        selected: false,
                        dialingId,
                    };
                else
                    return {
                        id: index,
                        img: null,
                        color,
                        selected: false,
                        dialingId,
                    };
            }
            return {
                id: index,
                img: null,
                color,
                selected: false,
                dialingId: null,
            };
        });
};
