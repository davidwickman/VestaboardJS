import axios from 'axios';
import { Formatter } from '../Formatter';
import { Installable as InstallableConstructor } from '../Installable/index';
import { post as postURL } from '../shared/url';

interface BoardConfig {
  apiKey?: string;
  apiSecret?: string;
  subId?: string;
  saveCredentials?: boolean;
}

export class Board {
  apiKey?: string;
  apiSecret?: string;
  subscriptionId?: string;
  Installable?: InstallableConstructor;

  constructor(
    apiKeyOrConfig?: string | BoardConfig,
    apiSecret?: string,
    subscriptionId?: string,
    Installable?: InstallableConstructor,
  ) {
    if (typeof apiKeyOrConfig === 'object') {
      // Handle single object parameter
      this.apiKey = apiKeyOrConfig.apiKey;
      this.apiSecret = apiKeyOrConfig.apiSecret;
      this.subscriptionId = apiKeyOrConfig.subId;
      this.Installable = new InstallableConstructor(
        this.apiKey,
        this.apiSecret,
        apiKeyOrConfig.saveCredentials
      );
    } else {
      // Handle individual parameters
      this.apiKey = apiKeyOrConfig;
      this.apiSecret = apiSecret;
      this.subscriptionId = subscriptionId;
      this.Installable = Installable;
    }

    if (!this.Installable) {
      this.Installable = new InstallableConstructor(this.apiKey, this.apiSecret);
    }

    if (!this.apiKey || !this.apiSecret || !this.subscriptionId) {
      // Create a new installable, which will check for saved creds
      // You might want to implement this logic
    }

    // Ensure apiKey is set from Installable if not provided directly
    this.apiKey = this.apiKey || this.Installable.apiKey;
  }

  post(message: string): void {
    const data = new Formatter()._standard(message);
    const url = postURL(this.subscriptionId!);
    const options = {
      method: 'POST' as const,
      url,
      headers: {
        'X-Vestaboard-Api-Key': this.apiKey || '',
        'X-Vestaboard-Api-Secret': this.apiSecret || '',
      },
      data,
    };

    console.log('options:', options);
    axios(options)
      .then((res) => console.log('Response:', res))
      .catch((err) => console.error('Error sending post:', err));
  }
}