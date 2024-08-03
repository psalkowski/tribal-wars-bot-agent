export enum ScreenType {
  /**
   * Ekran powitalny, wyświetlany raz na dzień
   */
  WELCOME = 'welcome',

  /**
   * Ekran widoku wioski
   */
  OVERVIEW = 'overview',
  /**
   * Ekran przeglądu przy wielu wioskach
   */
  OVERVIEW_VILLAGES = 'overview_villages',

  /**
   * Ratusz
   */
  MAIN = 'main',

  /**
   * Widok rekrutacji wszystkich jednostek w danej wiosce (wymagane KP)
   */
  TRAIN = 'train',

  /**
   * Kościół
   */
  CHURCH = 'church',

  /**
   * Pałac
   */
  SNOB = 'snob',

  /**
   * Kuźnia
   */
  SMITH = 'smith',

  /**
   * Plac
   */
  PLACE = 'place',

  /**
   * Rynek
   */
  MARKET = 'market',

  /**
   * Farm Assistant
   */
  FARM = 'am_farm',

  /**
   * Ekran z raportami
   */
  REPORT = 'report',
}
