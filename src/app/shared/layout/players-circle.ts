import { Player } from '../../typings';

export const positionPlayersInCircle = (
  players: Player[],
  containerDimensions: DOMRect
): Player[] => {
  const parentContainerX = containerDimensions.width / 2;
  const parentContainerY = containerDimensions.height / 2;
  const centerOfToken = calculatePlayerTokenSize(players.length) / 2;

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

export const calculatePlayerTokenSize = (playersCount: number) => {
  // we want additional size factor to be between 0.6 and 0.45, assuming min playerCount is 5 and max 20
  const additionalSizeFactor = 0.6 - (playersCount - 5) * 0.01;
  // token size should be influenced by the players count, values between 0.8 and 0.5
  const playerCountFactor = 1 / playersCount + additionalSizeFactor;
  return window.innerHeight * playerCountFactor * 0.13; // additional ephemeral number, can be changed
};
