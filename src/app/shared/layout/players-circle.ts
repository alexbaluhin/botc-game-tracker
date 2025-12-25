import { Player } from '../../typings';

export const positionPlayersInCircle = (
  players: Player[],
  tokenSize: number,
  containerDimensions: DOMRect
): Player[] => {
  const parentContainerX = containerDimensions.width / 2;
  const parentContainerY = containerDimensions.height / 2;
  const centerOfToken = tokenSize / 2;

  return players.map((player: Player, i: number) => {
    const t = ((2 * Math.PI) / players.length) * (i + players.length * 0.75);
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);
    const horizontalRadius = 150;
    const verticalRadius = 200;
    const superEllipseRadius = 2;

    const x =
      horizontalRadius *
        Math.sign(cosT) *
        Math.pow(Math.abs(cosT), 2 / superEllipseRadius) +
      parentContainerX -
      centerOfToken;
    const y =
      verticalRadius *
        Math.sign(sinT) *
        Math.pow(Math.abs(sinT), 2 / superEllipseRadius) +
      parentContainerY -
      centerOfToken;

    return {
      ...player,
      positionInGrimoire: { x: Math.round(x), y: Math.round(y) },
    };
  });
};
