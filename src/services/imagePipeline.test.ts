import { describe, it, expect, beforeEach } from 'vitest';
import { ImagePipeline } from './imagePipeline';

describe('ImagePipeline.getImageResolution', () => {
  it('clasifica 4K', () => {
    expect(ImagePipeline.getImageResolution(2160, 3840)).toBe('4K');
  });

  it('clasifica 1440p', () => {
    expect(ImagePipeline.getImageResolution(1440, 3200)).toBe('1440p');
  });

  it('clasifica 1080p por defecto en baja resolución', () => {
    expect(ImagePipeline.getImageResolution(720, 1280)).toBe('1080p');
  });
});
