export const sizeToStyle = (size, origSize) => {

  // Support negative sizes
  const correctedSize = {
    x:      size.width < 0 ? size.x + size.width : (size.x || 0),
    y:      size.height < 0 ? size.y + size.height : (size.y || 0),
    width:  Math.abs(size.width || 0),
    height: Math.abs(size.height || 0),
  };

  if (origSize) {
    const relative = (child, parent) => Math.floor(100 * child / parent);

    // Relative size
    return {
      left:   relative(correctedSize.x, origSize.width) + '%',
      top:    relative(correctedSize.y, origSize.height) + '%',
      width:  relative(correctedSize.width, origSize.width) + '%',
      height: relative(correctedSize.height, origSize.height) + '%',
    };

  }
  else {

    // Absolute size
    return {
      left:   correctedSize.x + 'px',
      top:    correctedSize.y + 'px',
      width:  correctedSize.width + 'px',
      height: correctedSize.height + 'px',
    };

  }

};
