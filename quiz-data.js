(function (root, factory) {
  'use strict';
  const data = factory();
  if (typeof module === 'object' && module.exports) module.exports = data;
  else root.QUEST_QUIZ = data;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const types = ['matsu', 'take', 'ume'];
  const raw = [
    ['今のあなたに最も近い状態は？', '実現したい目標があり、方法を具体化したい', '興味や関心はあるが、進む方向を整理したい', 'まだ明確な目標はないが、新しい世界を見てみたい'],
    ['将来について、今どの段階ですか？', '目指したい状態や目標がある程度決まっている', 'いくつか候補があり、比較・整理している', '何がしたいかも含めて、これから探したい'],
    ['今いちばん必要だと感じるものは？', '戦略・スキル・実行計画', '自己理解・価値観の整理・方向性', '人との出会い・刺激・新しい経験'],
    ['新しい活動に参加するなら、何を期待しますか？', '目標達成につながる具体的な成果や前進', '自分に合う選択肢や可能性の発見', 'まずは楽しみながら色々なことを試す'],
    ['仕事やプロジェクトへの関心は？', '自分で企画・運営し、成果を出すことに挑戦したい', '複数の仕事や役割を知り、自分の適性を見たい', '普段触れない仕事や世界を気軽に体験したい'],
    ['理想のライフスタイルはどのくらい明確ですか？', 'かなり明確で、実現方法を知りたい', 'ぼんやりイメージはあるので言葉にしたい', 'まだ分からないので、様々な生き方を知りたい'],
    ['今の自分が変えたいことは？', '行動量・成果・実行力を高めたい', '考え方や価値観を整理し、方向性を定めたい', '日常や人間関係に新しい刺激を増やしたい'],
    ['どんな仲間と関わりたいですか？', '目標を持ち、互いに挑戦・実践できる仲間', '多様な価値観を持ち、深く対話できる仲間', '気軽に出会い、一緒に新しい経験を楽しめる仲間'],
    ['体験の後、どんな状態になっていたいですか？', '具体的な計画と、すぐ実行する行動が決まっている', '自分の興味・強み・進みたい方向が整理されている', '新しい興味や、次に参加したい活動が見つかっている'],
    ['今のあなたの行動意欲に近いものは？', '目標に向けて、すぐに実践を始めたい', 'まず自分を整理し、納得できる方向を決めたい', 'まずは参加して、体験しながら考えたい']
  ];
  const questions = raw.map(([title, ...choices]) => ({title, choices: choices.map((text, i) => ({type:types[i], text}))}));
  const outcomes = {
    matsu: {name:'松', roman:'MATSU', title:'目標を、形にする。', subtitle:'実現したいことが見えているあなたへ', state:'目標や実現したいことが見えていて、具体的な方法・スキル・仲間・実行計画を求めている傾向があります。', reason:'「実現する方法」や「行動」に向かう回答が多く選ばれました。目標を具体的な一歩に分けてみる体験が、今の関心に合いそうです。', experience:'目標の具体化 → 課題の整理 → 実現方法のレクチャー → 最初のアクションの設計。', takeaway:'目標と課題の整理、30日以内に試す行動の候補。', cta:'松のオリエンテーション・個別相談を希望する'},
    take: {name:'竹', roman:'TAKE', title:'方向性を、見つめる。', subtitle:'自分の進む方向を整理したいあなたへ', state:'興味や可能性を感じながら、理想の暮らし・価値観・強み・進路を整理したい傾向があります。', reason:'「自分を理解すること」や「方向性の整理」に向かう回答が多く選ばれました。いくつかの選択肢を比べ、言葉にする時間が合いそうです。', experience:'自己理解 → 理想のライフスタイルの言語化 → 選択肢の比較 → 次に試す体験の選定。', takeaway:'大切にしたい価値観、方向性のメモ、次に試したい体験。', cta:'竹の体験・ライフスタイルデザインを希望する'},
    ume: {name:'梅', roman:'UME', title:'好奇心から、探す。', subtitle:'まずは新しい世界に触れてみたいあなたへ', state:'まだ目標が明確でなくても、人・仕事・役割・価値観に触れながら、気になることを見つけたい傾向があります。', reason:'「出会い」や「新しい経験」に向かう回答が多く選ばれました。まず小さな体験をして、心が動いたことを振り返る入口が合いそうです。', experience:'交流やイベントに参加 → 普段触れない仕事・役割を知る → 感じたことを振り返る。', takeaway:'気になったことの記録、新しいつながり、次の体験候補。', cta:'梅の交流会・体験イベントを希望する'}
  };
  function scoreAnswers(answers) {
    if (!Array.isArray(answers) || answers.length !== questions.length || Array.from(answers).some(a => !types.includes(a))) throw new TypeError('10問すべてに有効な回答が必要です。');
    const scores = {matsu:0,take:0,ume:0};
    answers.forEach(a => scores[a]++);
    const max = Math.max(...Object.values(scores));
    return {scores, matches:types.filter(t => scores[t] === max)};
  }
  function restoreProgress(saved) {
    if (!saved || !Array.isArray(saved.answers) || saved.answers.length!==10 || Array.from(saved.answers).some(a=>a!==null && !types.includes(a)) || !Number.isInteger(saved.step) || saved.step<0 || saved.step>=10) return null;
    const firstUnanswered=saved.answers.indexOf(null);
    return {answers:[...saved.answers],step:firstUnanswered<0?saved.step:Math.min(saved.step,firstUnanswered),completed:saved.completed===true && firstUnanswered<0};
  }
  return {questions, outcomes, scoreAnswers, restoreProgress};
}));
