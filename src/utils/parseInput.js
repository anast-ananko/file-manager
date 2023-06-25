export const parseInput = (str) => {
  const newStr = str.replace(/\s+/g, ' ');
  const matches = newStr.match(/(['"])(.*?)\1|\S+/g); 

  const parsedPieces = matches.map(piece => {
    if (piece.startsWith('"') && piece.endsWith('"')) {
      return piece.slice(1, -1);
    } else if (piece.startsWith("'") && piece.endsWith("'")) {
      return piece.slice(1, -1);
    }
    return piece;
  });

  return parsedPieces;
}
