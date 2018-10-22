module.exports = () => {

  class Quotes {            
      constructor() {
        this.tips = [
          'Java относится к JavaScript так же, как Сом к Сомали.',
          'Это не баг — это незадокументированная фича.',
          'Плохое ПО одного человека — постоянная работа другого.',
          'Если сразу не получилось хорошо, назовите это версией 1.0.',
          'Не волнуйся, если не работает. Если бы все всегда работало, у тебя бы не было работы.'
        ];
      }
  }

  class Advises {
      constructor() {
      this.tips = [
        'Той, хто сміється останнім, можливо не зрозумів жарту.',
        'Як багато можна цікавого почути, якщо частіше мовчати.',
        'Посмішка має ефект дзеркала - посміхнися і ти побачиш посмішку...',
        'Рухайся не поспішаючи, але завжди тільки вперед.',
        'Старайся! І у тебе все обов\'язково вийде.'
      ]
    }
  }

  class Tip {
    create (type) {
      let tip;
      if (type === 'show quote') {
        tip = new Quotes()
      } else if (type === '#@)₴?$0') {
        tip = new Advises()
      } 

      if(tip != undefined) {
        tip.type = type
        tip.getMessage = function () {
          
          const minCountOfTips = 0;
          const maxCountOfTips = this.tips.length - 1;
          const getRoundomNumberOfTip = Math.floor(Math.random() * (maxCountOfTips - minCountOfTips + 1)) + minCountOfTips;
          const getStringOfTipByNumber = this.tips[getRoundomNumberOfTip];

          return getStringOfTipByNumber;
        }
        return tip;
      } else {
        return false
      }
    }
  }
  return new Tip()
}