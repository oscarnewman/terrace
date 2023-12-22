import { Command } from 'packages/cli/command'
import chalk from 'chalk'

export default class extends Command {
  public static signature = 'inspire'

  public async handle(): Promise<void> {
    const inspirations = [
      '“The best time to plant a tree was 20 years ago. The second best time is now.” – Chinese Proverb',
      '“By three methods we may learn wisdom: First, by reflection, which is noblest; Second, by imitation, which is easiest; and third by experience, which is the bitterest.” – Confucius',
      '“An investment in knowledge pays the best interest.” – Benjamin Franklin',
      '“Simplicity is the ultimate sophistication.” – Leonardo da Vinci',
      '“If you can’t explain it simply, you don’t understand it well enough.” – Albert Einstein',
      '“The only true wisdom is in knowing you know nothing.” – Socrates',
      '“Life is not a problem to be solved, but a reality to be experienced.” – Soren Kierkegaard',
      '“Everything has beauty, but not everyone can see.” – Confucius',
      '“Life is really simple, but we insist on making it complicated.” – Confucius',
      '“Life isn’t about finding yourself. Life is about creating yourself.” – George Bernard Shaw',
      '“If you want to live a happy life, tie it to a goal, not to people or things.” – Albert Einstein',
      '“Never let the fear of striking out stop you from playing the game.” – Babe Ruth',
      '“Money and success don’t change people; they merely amplify what is already there.” – Will Smith',
      '“Your time is limited, so don’t waste it living someone else’s life.” – Steve Jobs',
      '“Winning isn’t everything, but wanting to win is.” – Vince Lombardi',
      '“I am not a product of my circumstances. I am a product of my decisions.” – Stephen Covey',
      '“Every child is an artist. The problem is how to remain an artist once he grows up.” – Pablo Picasso',
      '“You can never cross the ocean until you have the courage to lose sight of the shore.” – Christopher Columbus',
      '“Either you run the day, or the day runs you.” – Jim Rohn',
      '“Whether you think you can or you think you can’t, you’re right.” – Henry Ford',
      '“The two most important days in your life are the day you are born and the day you find out why.” – Mark Twain',
    ]

    const random = Math.floor(Math.random() * inspirations.length)
    console.log('\n\n\t' + chalk.bgBlue(inspirations[random]) + '\n\n')
  }
}
