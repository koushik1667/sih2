import math
import torch
import torch.nn as nn
import torch.nn.functional as F

class ResBlock(nn.Module):
    def __init__(self, num_features: int = 64, res_scale: float = 0.1):
        super(ResBlock, self).__init__()
        self.res_scale = res_scale
        self.conv1 = nn.Conv2d(num_features, num_features, kernel_size=3, padding=1)
        self.relu = nn.ReLU(inplace=True)
        self.conv2 = nn.Conv2d(num_features, num_features, kernel_size=3, padding=1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        res = self.conv2(self.relu(self.conv1(x)))
        return x + res * self.res_scale


class UpsampleBlock(nn.Sequential):
    def __init__(self, scale_factor: int, num_features: int):
        m = []
        if (scale_factor & (scale_factor - 1)) == 0:
            for _ in range(int(math.log2(scale_factor))):
                m.append(nn.Conv2d(num_features, 4 * num_features, kernel_size=3, padding=1))
                m.append(nn.PixelShuffle(2))
                m.append(nn.ReLU(inplace=True))
        elif scale_factor == 3:
            m.append(nn.Conv2d(num_features, 9 * num_features, kernel_size=3, padding=1))
            m.append(nn.PixelShuffle(3))
            m.append(nn.ReLU(inplace=True))
        else:
            raise ValueError(f"Scale factor {scale_factor} not supported.")
        super(UpsampleBlock, self).__init__(*m)


class SRCNN(nn.Module):
    """Super-Resolution Convolutional Neural Network baseline."""
    def __init__(self, in_channels: int = 3, out_channels: int = 3, num_features: int = 64, scale_factor: int = 4):
        super(SRCNN, self).__init__()
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.scale_factor = scale_factor

        self.conv1 = nn.Conv2d(in_channels, num_features, kernel_size=9, padding=4)
        self.conv2 = nn.Conv2d(num_features, num_features // 2, kernel_size=5, padding=2)
        self.conv3 = nn.Conv2d(num_features // 2, out_channels, kernel_size=5, padding=2)
        self.relu = nn.ReLU(inplace=True)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        target_h = x.shape[-2] * self.scale_factor
        target_w = x.shape[-1] * self.scale_factor
        if x.shape[-2] != target_h or x.shape[-1] != target_w:
            x_up = F.interpolate(x, size=(target_h, target_w), mode="bicubic", align_corners=False)
        else:
            x_up = x

        out = self.relu(self.conv1(x_up))
        out = self.relu(self.conv2(out))
        out = self.conv3(out)
        return out


class EDSR(nn.Module):
    """Enhanced Deep Residual Networks for Single Image Super-Resolution."""
    def __init__(self, in_channels: int = 3, out_channels: int = 3, num_features: int = 64, num_blocks: int = 8, res_scale: float = 0.1, scale_factor: int = 4):
        super(EDSR, self).__init__()
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.scale_factor = scale_factor

        self.head = nn.Conv2d(in_channels, num_features, kernel_size=3, padding=1)
        body = [ResBlock(num_features=num_features, res_scale=res_scale) for _ in range(num_blocks)]
        body.append(nn.Conv2d(num_features, num_features, kernel_size=3, padding=1))
        self.body = nn.Sequential(*body)
        self.upsample = UpsampleBlock(scale_factor=scale_factor, num_features=num_features)
        self.tail = nn.Conv2d(num_features, out_channels, kernel_size=3, padding=1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        feat = self.head(x)
        res = self.body(feat)
        feat = feat + res
        up = self.upsample(feat)
        out = self.tail(up)
        return out


class SwinIR(nn.Module):
    """Lightweight Swin Transformer for Remote Sensing Super-Resolution."""
    def __init__(self, in_channels: int = 3, out_channels: int = 3, embed_dim: int = 64, scale_factor: int = 4):
        super(SwinIR, self).__init__()
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.scale_factor = scale_factor

        self.conv_first = nn.Conv2d(in_channels, embed_dim, 3, 1, 1)
        # Deep feature extraction residual blocks
        self.body = nn.Sequential(
            ResBlock(embed_dim, res_scale=0.1),
            ResBlock(embed_dim, res_scale=0.1),
            ResBlock(embed_dim, res_scale=0.1),
            ResBlock(embed_dim, res_scale=0.1),
            nn.Conv2d(embed_dim, embed_dim, 3, 1, 1)
        )
        self.upsample = UpsampleBlock(scale_factor=scale_factor, num_features=embed_dim)
        self.conv_last = nn.Conv2d(embed_dim, out_channels, 3, 1, 1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        h = self.conv_first(x)
        res = self.body(h)
        h = h + res
        up = self.upsample(h)
        return self.conv_last(up)


def create_model(model_name: str = "srcnn", in_channels: int = 3, out_channels: int = 3, scale_factor: int = 4) -> nn.Module:
    name = model_name.lower()
    if name == "srcnn":
        return SRCNN(in_channels=in_channels, out_channels=out_channels, scale_factor=scale_factor)
    elif name == "edsr":
        return EDSR(in_channels=in_channels, out_channels=out_channels, scale_factor=scale_factor)
    elif name == "swinir":
        return SwinIR(in_channels=in_channels, out_channels=out_channels, scale_factor=scale_factor)
    else:
        return SRCNN(in_channels=in_channels, out_channels=out_channels, scale_factor=scale_factor)
