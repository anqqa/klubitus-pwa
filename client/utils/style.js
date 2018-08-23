export const sizeToStyle = (size, origSize) => {
  if (origSize) {
    const relative = (child, parent) => Math.floor(100 * (child || 0) / parent);

    // Relative size
    return {
      left:   relative(size.x, origSize.width) + '%',
      top:    relative(size.y, origSize.height) + '%',
      width:  relative(size.width, origSize.width) + '%',
      height: relative(size.height, origSize.height) + '%',
    };

  }
  else {

    // Absolute size
    return {
      left:   (size.x || 0) + 'px',
      top:    (size.y || 0) + 'px',
      width:  (size.width || 0) + 'px',
      height: (size.height || 0) + 'px',
    };

  }

};
