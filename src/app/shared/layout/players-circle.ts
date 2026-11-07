import { Player } from '../types/common';

const ELLIPSE_ASPECT_RATIO = 1.35;
const EDGE_PADDING = 12;
const PLAYER_TOKEN_HORIZONTAL_SPACE = 24;
const ARC_LENGTH_SAMPLES = 720;
const START_ANGLE = -Math.PI / 2;

export const positionPlayersInEllipse = (
  players: Player[],
  containerDimensions: DOMRect
): Player[] => {
  if (players.length === 0) {
    return [];
  }

  const centerX = containerDimensions.width / 2;
  const centerY = containerDimensions.height / 2;
  const tokenRadius = calculatePlayerTokenSize(players.length) / 2;
  const playerTokenHalfWidth = tokenRadius + PLAYER_TOKEN_HORIZONTAL_SPACE / 2;
  const horizontalRadius = Math.max(
    0,
    centerX - playerTokenHalfWidth - EDGE_PADDING
  );
  const verticalRadius = Math.max(
    0,
    Math.min(
      centerY - tokenRadius - EDGE_PADDING,
      horizontalRadius * ELLIPSE_ASPECT_RATIO
    )
  );
  const angles = calculateEvenlySpacedAngles(
    players.length,
    horizontalRadius,
    verticalRadius
  );

  return players.map((player: Player, i: number) => {
    const angle = angles[i];
    const x =
      centerX + horizontalRadius * Math.cos(angle) - playerTokenHalfWidth;
    const y = centerY + verticalRadius * Math.sin(angle) - tokenRadius;

    return {
      ...player,
      positionInGrimoire: { x: Math.round(x), y: Math.round(y) },
    };
  });
};

const calculateEvenlySpacedAngles = (
  playersCount: number,
  horizontalRadius: number,
  verticalRadius: number
): number[] => {
  const cumulativeLengths = [0];
  let previousX = horizontalRadius * Math.cos(START_ANGLE);
  let previousY = verticalRadius * Math.sin(START_ANGLE);

  for (let sample = 1; sample <= ARC_LENGTH_SAMPLES; sample++) {
    const angle = START_ANGLE + (sample / ARC_LENGTH_SAMPLES) * Math.PI * 2;
    const x = horizontalRadius * Math.cos(angle);
    const y = verticalRadius * Math.sin(angle);
    cumulativeLengths.push(
      cumulativeLengths[sample - 1] + Math.hypot(x - previousX, y - previousY)
    );
    previousX = x;
    previousY = y;
  }

  const circumference = cumulativeLengths.at(-1) ?? 0;
  if (circumference === 0) {
    return new Array(playersCount)
      .fill(null)
      .map((_, index) => START_ANGLE + (index / playersCount) * Math.PI * 2);
  }

  return new Array(playersCount).fill(null).map((_, index) => {
    const targetLength = (index / playersCount) * circumference;
    const upperSample = cumulativeLengths.findIndex(
      length => length >= targetLength
    );
    const lowerSample = Math.max(0, upperSample - 1);
    const segmentLength =
      cumulativeLengths[upperSample] - cumulativeLengths[lowerSample];
    const progress =
      segmentLength === 0
        ? 0
        : (targetLength - cumulativeLengths[lowerSample]) / segmentLength;
    const interpolatedSample = lowerSample + progress;

    return (
      START_ANGLE + (interpolatedSample / ARC_LENGTH_SAMPLES) * Math.PI * 2
    );
  });
};

export const calculatePlayerTokenSize = (playersCount: number) => {
  // we want additional size factor to be between 0.6 and 0.45, assuming min playerCount is 5 and max 20
  const additionalSizeFactor = 0.6 - (playersCount - 5) * 0.01;
  // token size should be influenced by the players count, values between 0.8 and 0.5
  const playerCountFactor = 1 / playersCount + additionalSizeFactor;
  return window.innerHeight * playerCountFactor * 0.13; // additional ephemeral number, can be changed
};
