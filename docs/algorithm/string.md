## STRING 

### 常用知识点

- String.prototype.split
- String.prototype.match
- Array.prototype.map
- Array.prototype.reverse
- Array.prototype.join

### 557. 反转字符串中的单词 III

```js
给定一个字符串，你需要反转字符串中每个单词的字符顺序，同时仍保留空格和单词的初始顺序。
输入: "Let's take LeetCode contest"
输出: "s'teL ekat edoCteeL tsetnoc" 
注意：在字符串中，每个单词由单个空格分隔，并且字符串中不会有任何额外的空格。
```

```js 
export default (str) => {
    //字符串按空格进行分隔,保存数组,数组的元素的先后顺序就是单词的顺序
    let arr = str.split(' ')
    // 数组进行遍历,然后每个元素进行反转
    let result = arr.map(item=>{
      return item.split('').reverse().join('')
    })
    return result.join(' ')
}

export default (s)=> {
  return s.split(' ').map(item=>{
      return item.split('').reverse().join('')
  }).join(' ')
};

export default (s)=> {
  return s.split(/\s/g).map(item=>{
      return item.split('').reverse().join('')
  }).join(' ')
};

export default (s)=> {
  return s.match(/[\w']+/g).map(item=>{
      return item.split('').reverse().join('')
  }).join(' ')
};
``` 

### 696. 计数二进制子串

```js
给定一个字符串 s，计算具有相同数量0和1的非空(连续)子字符串的数量，并且这些子字符串中的所有0和所有1都是组合在一起的。
重复出现的子串要计算它们出现的次数。
输入: "00110011"
输出: 6
解释: 有6个子串具有相同数量的连续1和0：“0011”，“01”，“1100”，“10”，“0011” 和 “01”。
请注意，一些重复出现的子串要计算它们出现的次数。
另外，“00110011”不是有效的子串，因为所有的0（和1）没有组合在一起。
输入: "10101"
输出: 4
解释: 有4个子串：“10”，“01”，“10”，“01”，它们具有相同数量的连续1和0
注意：
s.length 在1到50,000之间。
s 只包含“0”或“1”字符。
``` 

```js
var countBinarySubstring = function (s){
  let pre = 0 ,count = 0 , count1 = 0, count2 = 0;
  for(let i=1;i<s.length;i++){
    if(s[i]!==s[pre]){
      if(count1 === 0){
        pre = i
      }else{
        count2 = i - pre
        count += count1 > count2 ? count2 :count1
        count1 = count2
        pre = i 
      }
    }
    if(i === s.lenght -1){
      count2 = s.length - pre 
      count += count1 > count2 ? count2 : count1  
    }
  }
  return count 
}
```