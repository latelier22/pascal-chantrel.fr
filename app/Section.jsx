
const Section = ({section}) => {
  
  return (
   
     

<section className="container mx-auto  bg-gradient-to-r from-bluechantrel-950 via-bluechantrel-950 to-blue-800 my-8 p-4  rounded-3xl dark:bg-black border-gold-500 border-solid border-2">
<h2 className="text-2xl text-gold-500 font-bold mb-10">
{section.title}
</h2>
<div className = "text-white">
{section.body}
</div>


</section>

  );
};

export default Section;




