class CardManager {
  powerPlantCards: {} = {};

  private static instance: CardManager;
  private constructor() {}
  static getInstance(): CardManager {
    if (!CardManager.instance) {
      CardManager.instance = new CardManager();
    }
    return CardManager.instance;
  }
}
