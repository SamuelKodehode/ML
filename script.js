"use strict";
function main(generations, genSize, mutation) {
    const dataArray = [];
    const objArray = [];
    let bestDistance = Infinity;
    let bestDistanceIndex = Infinity;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const gX = Math.floor(Math.random() * canvas.width - 30);
    const gY = Math.floor(Math.random() * canvas.height - 30);
    const draw = (x, y, w, h, color, ctx) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    };
    function drawStrokedCircle(ctx, x, y, radius, fillColor) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = fillColor;
        ctx.fill();
        ctx.stroke();
    }
    function calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    for (let i = 0; i < 10; i++) {
        const squareArray = [];
        for (let j = 0; j < genSize; j++) {
            const getRandom = Math.floor(Math.random() * 4) + 1;
            squareArray.push(getRandom);
        }
        let squareObj = {
            xPosition: canvas.width / 2,
            yPosition: canvas.height / 2,
            distanceFromGoal: 0
        };
        objArray.push(squareObj);
        dataArray.push(squareArray);
    }
    function initLearning(ctx, numGenerations) {
        let generationCounter = 0;
        let lastFrameTime = 0;
        const fpsInterval = 1000 / 30;
        const animate = (timestamp) => {
            if (bestDistance < 7 || generationCounter >= numGenerations) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                main(Infinity, 2000, 20);
                return;
            }
            const elapsedTime = timestamp - lastFrameTime;
            if (elapsedTime > fpsInterval) {
                lastFrameTime = timestamp - (elapsedTime % fpsInterval);
                objArray.forEach((obj) => {
                    obj.xPosition = canvas.width / 2;
                    obj.yPosition = canvas.height / 2;
                });
                dataArray.forEach((array, rowIndex) => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    array.forEach((value) => {
                        if (value === 1) {
                            objArray[rowIndex].xPosition -= 4;
                        }
                        else if (value === 2) {
                            objArray[rowIndex].yPosition -= 4;
                        }
                        else if (value === 3) {
                            objArray[rowIndex].xPosition += 4;
                        }
                        else if (value === 4) {
                            objArray[rowIndex].yPosition += 4;
                        }
                        render(objArray[rowIndex].xPosition, objArray[rowIndex].yPosition, gX, gY, ctx, generationCounter);
                    });
                });
                bestDistance = Infinity;
                bestDistanceIndex = 0;
                objArray.forEach((obj, index) => {
                    obj.distanceFromGoal = calculateDistance(obj.xPosition, obj.yPosition, gX, gY);
                    if (obj.distanceFromGoal < bestDistance) {
                        bestDistance = obj.distanceFromGoal;
                        bestDistanceIndex = index;
                    }
                });
                dataArray.forEach((array, rowIndex) => {
                    if (rowIndex !== bestDistanceIndex) {
                        array.forEach((value, valueIndex) => {
                            array[valueIndex] = dataArray[bestDistanceIndex][valueIndex];
                        });
                    }
                    const randomIndices = Array.from({ length: mutation }, () => Math.floor(Math.random() * array.length));
                    randomIndices.forEach((randomIndex) => {
                        array[randomIndex] = Math.floor(Math.random() * 4) + 1;
                    });
                });
                objArray.forEach((obj, index) => {
                    obj.distanceFromGoal = calculateDistance(obj.xPosition, obj.yPosition, gX, gY);
                    if (obj.distanceFromGoal < bestDistance) {
                        bestDistance = obj.distanceFromGoal;
                        bestDistanceIndex = index;
                    }
                });
                generationCounter++;
            }
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }
    function render(x, y, gx, gy, ctx, generationCounter) {
        draw(x, y, 1, 1, 'white', ctx);
        drawStrokedCircle(ctx, gx, gy, 5, 'orange');
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Generations: ${generationCounter}`, 10, 20);
    }
    if (ctx !== null)
        initLearning(ctx, generations);
}
main(Infinity, 2000, 20);
//# sourceMappingURL=script.js.map